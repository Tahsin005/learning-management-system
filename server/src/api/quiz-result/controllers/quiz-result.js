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

    const roleName = user.role?.name || '';
    const roleType = user.role?.type || '';

    /** @type {Record<string, any>} */
    const filters = {};

    // if student, strictly filter to student's own results
    if (roleName === 'Student' || roleType === 'student') {
      filters.student = { id: user.id };
    }

    const results = await strapi.documents('api::quiz-result.quiz-result').findMany({
      filters,
      populate: ['quiz', 'student'],
      sort: { createdAt: 'desc' },
    });

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
          page: 1,
          pageSize: sanitizedResults.length,
          pageCount: 1,
          total: sanitizedResults.length,
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
      populate: ['quiz', 'student'],
    });

    if (!result) {
      result = await strapi.db.query('api::quiz-result.quiz-result').findOne({
        where: { id },
        populate: ['quiz', 'student'],
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
