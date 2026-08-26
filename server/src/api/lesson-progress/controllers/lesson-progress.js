'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::lesson-progress.lesson-progress', ({ strapi }) => ({
  async create(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required.');
    }

    const payload = ctx.request.body?.data || ctx.request.body;
    const lessonTarget = payload?.lesson;
    const isCompleted = payload?.completed !== undefined ? Boolean(payload.completed) : true;

    if (!lessonTarget) {
      return ctx.badRequest('Lesson identifier is required.');
    }

    const lessonDocId =
      typeof lessonTarget === 'object'
        ? lessonTarget.documentId || lessonTarget.id
        : lessonTarget;

    // verify lesson exists
    let lesson = await strapi.documents('api::lesson.lesson').findOne({
      documentId: lessonDocId,
      populate: ['course'],
    });

    if (!lesson) {
      lesson = await strapi.query('api::lesson.lesson').findOne({
        where: { id: lessonDocId },
        populate: ['course'],
      });
    }

    if (!lesson) {
      return ctx.notFound('Lesson not found.');
    }

    // check if progress record already exists (Upsert logic)
    const existingProgress = await strapi.documents('api::lesson-progress.lesson-progress').findFirst({
      filters: {
        student: { id: user.id },
        lesson: { documentId: lesson.documentId || lessonDocId },
      },
    });

    if (existingProgress) {
      const updated = await strapi.documents('api::lesson-progress.lesson-progress').update({
        documentId: existingProgress.documentId,
        data: /** @type {any} */ ({
          completed: isCompleted,
          completedAt: isCompleted ? new Date() : null,
        }),
      });

      return ctx.send({
        message: 'Lesson progress updated.',
        data: updated,
      });
    }

    const progress = await strapi.documents('api::lesson-progress.lesson-progress').create({
      data: {
        student: user.id,
        lesson: lesson.documentId || lesson.id,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    return ctx.created({
      message: 'Lesson progress created.',
      data: progress,
    });
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

    // filter by student if role is Student
    if (roleName === 'Student' || roleType === 'student') {
      filters.student = { id: user.id };
    } else if (roleName === 'Instructor' || roleType === 'instructor') {
      filters.lesson = { course: { owner: { id: user.id } } };
    }

    const progresses = await strapi.documents('api::lesson-progress.lesson-progress').findMany({
      filters,
      populate: ['lesson', 'student'],
      sort: { createdAt: 'desc' },
    });

    const sanitizedProgresses = progresses.map((p) => ({
      id: p.id,
      documentId: p.documentId,
      completed: p.completed,
      completedAt: p.completedAt,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      publishedAt: p.publishedAt,
      lesson: p.lesson
        ? {
            id: p.lesson.id,
            documentId: p.lesson.documentId,
            title: p.lesson.title,
          }
        : null,
      student: p.student
        ? {
            id: p.student.id,
            documentId: p.student.documentId,
            username: p.student.username,
            email: p.student.email,
          }
        : null,
    }));

    return ctx.send({
      data: sanitizedProgresses,
      meta: {
        pagination: {
          page: 1,
          pageSize: sanitizedProgresses.length,
          pageCount: 1,
          total: sanitizedProgresses.length,
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
    let progress = await strapi.documents('api::lesson-progress.lesson-progress').findOne({
      documentId: id,
      populate: ['lesson', 'student'],
    });

    if (!progress) {
      progress = await strapi.db.query('api::lesson-progress.lesson-progress').findOne({
        where: { id },
        populate: ['lesson', 'student'],
      });
    }

    if (!progress) {
      return ctx.notFound('Lesson progress not found.');
    }

    const roleName = user.role?.name || '';
    const roleType = user.role?.type || '';

    if ((roleName === 'Student' || roleType === 'student') && progress.student?.id !== user.id) {
      return ctx.forbidden('Access denied.');
    }

    return ctx.send({
      data: {
        id: progress.id,
        documentId: progress.documentId,
        completed: progress.completed,
        completedAt: progress.completedAt,
        createdAt: progress.createdAt,
        updatedAt: progress.updatedAt,
        publishedAt: progress.publishedAt,
        lesson: progress.lesson
          ? {
              id: progress.lesson.id,
              documentId: progress.lesson.documentId,
              title: progress.lesson.title,
            }
          : null,
        student: progress.student
          ? {
              id: progress.student.id,
              documentId: progress.student.documentId,
              username: progress.student.username,
              email: progress.student.email,
            }
          : null,
      },
    });
  },
}));
