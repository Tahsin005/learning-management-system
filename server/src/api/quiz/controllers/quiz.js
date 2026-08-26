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
      populate: ['course.owner'],
    });

    if (!quiz) {
      quiz = await strapi.query('api::quiz.quiz').findOne({
        where: { id },
        populate: ['course.owner'],
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

    return super.update(ctx);
  },

  async delete(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required.');
    }

    const { id } = ctx.params;
    let quiz = await strapi.documents('api::quiz.quiz').findOne({
      documentId: id,
      populate: ['course.owner'],
    });

    if (!quiz) {
      quiz = await strapi.query('api::quiz.quiz').findOne({
        where: { id },
        populate: ['course.owner'],
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

    return super.delete(ctx);
  },

  async find(ctx) {
    const { user } = ctx.state;
    const isAuthorizedStaff =
      user &&
      (['Admin', 'Content Manager', 'Instructor'].includes(user.role?.name) ||
        ['admin', 'content_manager', 'instructor'].includes(user.role?.type));

    const quizzes = await strapi.documents('api::quiz.quiz').findMany({
      populate: ['questions', 'course'],
      sort: { createdAt: 'desc' },
    });

    const sanitizedQuizzes = quizzes.map((q) => {
      const copy = { ...q };
      sanitizeQuizQuestions(copy, isAuthorizedStaff);
      return copy;
    });

    return ctx.send({
      data: sanitizedQuizzes,
      meta: {
        pagination: {
          page: 1,
          pageSize: sanitizedQuizzes.length,
          pageCount: 1,
          total: sanitizedQuizzes.length,
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

    if (!quiz) {
      quiz = await strapi.db.query('api::quiz.quiz').findOne({
        where: { id },
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
