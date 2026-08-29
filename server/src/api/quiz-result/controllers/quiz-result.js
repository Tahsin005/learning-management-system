'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::quiz-result.quiz-result', ({ strapi }) => ({
  async submit(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required to submit quiz.');
    }

    const payload = ctx.request.body?.data || ctx.request.body;
    const quizId = payload?.quizId || payload?.quiz;
    const submittedAnswers = Array.isArray(payload?.answers) ? payload.answers : [];

    if (!quizId) {
      return ctx.badRequest('Quiz identifier (quizId) is required.');
    }

    // find full quiz with question components (including correctAnswerIndex)
    let quiz = await strapi.documents('api::quiz.quiz').findOne({
      documentId: quizId,
      populate: ['questions', 'course'],
    });

    if (!quiz) {
      quiz = await strapi.query('api::quiz.quiz').findOne({
        where: { id: quizId },
        populate: ['questions', 'course'],
      });
    }

    if (!quiz) {
      return ctx.notFound('Quiz not found.');
    }

    // verify student enrollment in the course
    const courseDocId = quiz.course?.documentId;
    if (courseDocId) {
      const enrollment = await strapi.documents('api::enrollment.enrollment').findFirst({
        filters: {
          student: { id: user.id },
          course: { documentId: courseDocId },
        },
      });

      if (!enrollment) {
        return ctx.forbidden('You must be enrolled in this course to take and submit this quiz.');
      }
    }

    // verify student has not already submitted this quiz
    const existingResult = await strapi.documents('api::quiz-result.quiz-result').findFirst({
      filters: {
        student: { id: user.id },
        quiz: { documentId: quiz.documentId || quizId },
      },
    });

    if (existingResult) {
      return ctx.badRequest('You have already submitted this assessment. Multiple submissions are not permitted.');
    }

    const questions = quiz.questions || [];
    const totalQuestions = questions.length;
    let score = 0;

    const detailedAnswers = questions.map((q, idx) => {
      const studentAns = submittedAnswers.find(
        (a) => a.questionIndex === idx || a.questionId === q.id
      ) || {};

      const selectedOptionIndex =
        studentAns.selectedOptionIndex !== undefined
          ? studentAns.selectedOptionIndex
          : null;

      const isCorrect =
        selectedOptionIndex !== null &&
        selectedOptionIndex === q.correctAnswerIndex;

      if (isCorrect) {
        score++;
      }

      return {
        questionIndex: idx,
        questionText: q.questionText,
        options: q.options,
        selectedOptionIndex,
        correctAnswerIndex: q.correctAnswerIndex,
        isCorrect,
      };
    });

    const result = await strapi.documents('api::quiz-result.quiz-result').create({
      data: {
        student: user.id,
        quiz: quiz.documentId || quiz.id,
        score,
        totalQuestions,
        answers: detailedAnswers,
        submittedAt: new Date(),
      },
    });

    return ctx.send({
      message: 'Quiz submitted and graded successfully.',
      documentId: result.documentId || result.id,
      score,
      totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
      answers: detailedAnswers,
      submittedAt: result.submittedAt,
    });
  },

  async create(ctx, next) {
    // route any standard create to the secure auto-grader
    return this.submit(ctx, next);
  },

  async find(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required.');
    }

    const { sort, filters: customFilters = {} } = ctx.query || {};

    /** @type {Record<string, any>} */
    const pagination = ctx.query && typeof ctx.query.pagination === 'object' && ctx.query.pagination !== null
      ? /** @type {Record<string, any>} */ (ctx.query.pagination)
      : {};

    const page = pagination.page ? Math.max(1, parseInt(pagination.page, 10)) : 1;
    const pageSize = pagination.pageSize ? Math.max(1, parseInt(pagination.pageSize, 10)) : 25;
    const start = pagination.start !== undefined ? Math.max(0, parseInt(pagination.start, 10)) : (page - 1) * pageSize;
    const limit = pagination.limit !== undefined ? Math.max(1, parseInt(pagination.limit, 10)) : pageSize;

    const roleName = user.role?.name || '';
    const roleType = user.role?.type || '';

    /** @type {Record<string, any>} */
    const filters = typeof customFilters === 'object' && customFilters !== null ? { ...customFilters } : {};

    // if student, strictly filter to student's own results
    if (roleName === 'Student' || roleType === 'student') {
      filters.student = { id: user.id };
    } else if (roleName === 'Instructor' || roleType === 'instructor') {
      const existingQuizFilters =
        typeof filters.quiz === 'object' && filters.quiz !== null ? filters.quiz : {};
      const existingCourseFilters =
        typeof existingQuizFilters.course === 'object' && existingQuizFilters.course !== null
          ? existingQuizFilters.course
          : {};

      filters.quiz = {
        ...existingQuizFilters,
        course: {
          ...existingCourseFilters,
          owner: { id: user.id },
        },
      };
    }

    const [results, total] = await Promise.all([
      strapi.documents('api::quiz-result.quiz-result').findMany({
        filters,
        populate: {
          quiz: {
            populate: ['course'],
          },
          student: true,
        },
        sort: /** @type {any} */ (sort) || { createdAt: 'desc' },
        start,
        limit,
      }),
      strapi.documents('api::quiz-result.quiz-result').count({ filters }),
    ]);

    const sanitizedResults = results.map((r) => ({
      id: r.id,
      documentId: r.documentId,
      score: r.score,
      totalQuestions: r.totalQuestions,
      answers: r.answers,
      submittedAt: r.submittedAt,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      publishedAt: r.publishedAt,
      quiz: r.quiz
        ? {
            id: r.quiz.id,
            documentId: r.quiz.documentId,
            title: r.quiz.title,
            course: r.quiz.course
              ? {
                  id: r.quiz.course.id,
                  documentId: r.quiz.course.documentId,
                  title: r.quiz.course.title,
                }
              : null,
          }
        : null,
      student: r.student
        ? {
            id: r.student.id,
            documentId: r.student.documentId,
            username: r.student.username,
            email: r.student.email,
          }
        : null,
    }));

    return ctx.send({
      data: sanitizedResults,
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
    if (!user) {
      return ctx.unauthorized('Authentication required.');
    }

    const { id } = ctx.params;
    let result = await strapi.documents('api::quiz-result.quiz-result').findOne({
      documentId: id,
      populate: {
        quiz: {
          populate: ['course.owner'],
        },
        student: true,
      },
    });

    if (!result) {
      result = await strapi.db.query('api::quiz-result.quiz-result').findOne({
        where: { id },
        populate: {
          quiz: {
            populate: ['course.owner'],
          },
          student: true,
        },
      });
    }

    if (!result) {
      return ctx.notFound('Quiz result not found.');
    }

    const roleName = user.role?.name || '';
    const roleType = user.role?.type || '';

    if ((roleName === 'Student' || roleType === 'student') && result.student?.id !== user.id) {
      return ctx.forbidden('Access denied.');
    }

    if (
      (roleName === 'Instructor' || roleType === 'instructor') &&
      result.quiz?.course?.owner?.id !== user.id
    ) {
      return ctx.forbidden('Access denied. You can only view quiz results for courses you own.');
    }

    return ctx.send({
      data: {
        id: result.id,
        documentId: result.documentId,
        score: result.score,
        totalQuestions: result.totalQuestions,
        answers: result.answers,
        submittedAt: result.submittedAt,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        publishedAt: result.publishedAt,
        quiz: result.quiz
          ? {
              id: result.quiz.id,
              documentId: result.quiz.documentId,
              title: result.quiz.title,
              course: result.quiz.course
                ? {
                    id: result.quiz.course.id,
                    documentId: result.quiz.course.documentId,
                    title: result.quiz.course.title,
                  }
                : null,
            }
          : null,
        student: result.student
          ? {
              id: result.student.id,
              documentId: result.student.documentId,
              username: result.student.username,
              email: result.student.email,
            }
          : null,
      },
    });
  },
}));
