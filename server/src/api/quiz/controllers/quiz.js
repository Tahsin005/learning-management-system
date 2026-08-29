'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

async function checkCourseOwnership(strapi, courseIdOrDocId, userId, userRole) {
  if (['Admin', 'Content Manager'].includes(userRole?.name) || ['admin', 'content_manager'].includes(userRole?.type)) {
    return true;
  }
  if (userRole?.name !== 'Instructor' && userRole?.type !== 'instructor') {
    return false;
  }

  let course = await strapi.documents('api::course.course').findOne({
    documentId: courseIdOrDocId,
    populate: ['owner'],
  });

  if (!course) {
    course = await strapi.query('api::course.course').findOne({
      where: { id: courseIdOrDocId },
      populate: ['owner'],
    });
  }

  return course?.owner?.id === userId;
}

function sanitizeQuizQuestions(quiz, isAuthorizedStaff) {
  if (isAuthorizedStaff || !quiz) return quiz;

  if (Array.isArray(quiz.questions)) {
    quiz.questions = quiz.questions.map((q) => {
      // create a clean copy without correctAnswerIndex
      const { correctAnswerIndex, ...safeQuestion } = q;
      return safeQuestion;
    });
  }
  return quiz;
}

module.exports = createCoreController('api::quiz.quiz', ({ strapi }) => ({
  async create(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required to create a quiz.');
    }

    const courseTarget = ctx.request.body?.data?.course;
    if (!courseTarget) {
      return ctx.badRequest('Course relation is required when creating a quiz.');
    }

    const courseId = typeof courseTarget === 'object' ? (courseTarget.documentId || courseTarget.id) : courseTarget;
    const canManage = await checkCourseOwnership(strapi, courseId, user.id, user.role);

    if (!canManage) {
      return ctx.forbidden('You do not have permission to add quizzes to this course.');
    }

    return super.create(ctx);
  },

  async update(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required.');
    }

    const { id } = ctx.params;
    let quiz = await strapi.documents('api::quiz.quiz').findOne({
      documentId: id,
      populate: {
        course: {
          populate: ['owner'],
        },
      },
    });

    if (!quiz) {
      quiz = await strapi.query('api::quiz.quiz').findOne({
        where: { id },
        populate: {
          course: {
            populate: ['owner'],
          },
        },
      });
    }

    if (!quiz) {
      return ctx.notFound('Quiz not found.');
    }

    const canManage =
      ['Admin', 'Content Manager'].includes(user.role?.name) ||
      ['admin', 'content_manager'].includes(user.role?.type) ||
      quiz.course?.owner?.id === user.id;

    if (!canManage) {
      return ctx.forbidden('You do not have permission to update this quiz.');
    }

    const quizDocId = quiz.documentId || quiz.id;
    const payload = ctx.request.body?.data || ctx.request.body || {};

    let updateRes;
    await strapi.db.transaction(async () => {
      // If instructor modified the questions/answer keys, reset obsolete past submissions for this quiz
      if (payload.questions && Array.isArray(payload.questions)) {
        const oldResults = await strapi.documents('api::quiz-result.quiz-result').findMany({
          filters: { quiz: { documentId: quizDocId } },
        });
        for (const r of oldResults) {
          await strapi.documents('api::quiz-result.quiz-result').delete({ documentId: r.documentId });
        }
      }

      updateRes = await super.update(ctx);
    });

    return updateRes;
  },

  async delete(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required.');
    }

    const { id } = ctx.params;
    let quiz = await strapi.documents('api::quiz.quiz').findOne({
      documentId: id,
      populate: {
        course: {
          populate: ['owner'],
        },
      },
    });

    if (!quiz) {
      quiz = await strapi.query('api::quiz.quiz').findOne({
        where: { id },
        populate: {
          course: {
            populate: ['owner'],
          },
        },
      });
    }

    if (!quiz) {
      return ctx.notFound('Quiz not found.');
    }

    const canManage =
      ['Admin', 'Content Manager'].includes(user.role?.name) ||
      ['admin', 'content_manager'].includes(user.role?.type) ||
      quiz.course?.owner?.id === user.id;

    if (!canManage) {
      return ctx.forbidden('You do not have permission to delete this quiz.');
    }

    const quizDocId = String(quiz.documentId || quiz.id);

    await strapi.db.transaction(async () => {
      // Cascade delete associated quiz result records
      const results = await strapi.documents('api::quiz-result.quiz-result').findMany({
        filters: { quiz: { documentId: quizDocId } },
      });
      for (const r of results) {
        await strapi.documents('api::quiz-result.quiz-result').delete({ documentId: r.documentId });
      }

      await strapi.documents('api::quiz.quiz').delete({ documentId: quizDocId });
    });

    return ctx.send({
      message: 'Quiz and associated submission results deleted successfully.',
      data: { documentId: quizDocId, id: quiz.id, title: quiz.title },
    });
  },

  async find(ctx) {
    const { user } = ctx.state;
    const isAuthorizedStaff =
      user &&
      (['Admin', 'Content Manager', 'Instructor'].includes(user.role?.name) ||
        ['admin', 'content_manager', 'instructor'].includes(user.role?.type));

    const { sort, filters: customFilters = {} } = ctx.query || {};

    /** @type {Record<string, any>} */
    const pagination = ctx.query && typeof ctx.query.pagination === 'object' && ctx.query.pagination !== null
      ? /** @type {Record<string, any>} */ (ctx.query.pagination)
      : {};

    const page = pagination.page ? Math.max(1, parseInt(pagination.page, 10)) : 1;
    const pageSize = pagination.pageSize ? Math.max(1, parseInt(pagination.pageSize, 10)) : 25;
    const start = pagination.start !== undefined ? Math.max(0, parseInt(pagination.start, 10)) : (page - 1) * pageSize;
    const limit = pagination.limit !== undefined ? Math.max(1, parseInt(pagination.limit, 10)) : pageSize;

    const filters = typeof customFilters === 'object' && customFilters !== null ? customFilters : {};

    const [quizzes, total] = await Promise.all([
      strapi.documents('api::quiz.quiz').findMany({
        filters,
        populate: ['questions', 'course'],
        sort: /** @type {any} */ (sort) || { createdAt: 'desc' },
        start,
        limit,
      }),
      strapi.documents('api::quiz.quiz').count({ filters }),
    ]);

    const sanitizedQuizzes = quizzes.map((q) => {
      const copy = { ...q };
      sanitizeQuizQuestions(copy, isAuthorizedStaff);
      return copy;
    });

    return ctx.send({
      data: sanitizedQuizzes,
      meta: {
        pagination: {
          page: Math.floor(start / limit) + 1,
          pageSize: limit,
          pageCount: Math.ceil(total / limit) || 1,
          total,
        },
      },
    });
  },

  async findOne(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;

    const isAuthorizedStaff =
      user &&
      (['Admin', 'Content Manager', 'Instructor'].includes(user.role?.name) ||
        ['admin', 'content_manager', 'instructor'].includes(user.role?.type));

    let quiz = await strapi.documents('api::quiz.quiz').findOne({
      documentId: id,
      populate: ['questions', 'course'],
    });

    if (!quiz && !isNaN(Number(id))) {
      quiz = await strapi.db.query('api::quiz.quiz').findOne({
        where: { id: Number(id) },
        populate: ['questions', 'course'],
      });
    }

    if (!quiz) {
      return ctx.notFound('Quiz not found.');
    }

    const copy = { ...quiz };
    sanitizeQuizQuestions(copy, isAuthorizedStaff);

    return ctx.send({
      data: copy,
    });
  },
}));
