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

    // verify student enrollment in the course
    const courseDocId = lesson.course?.documentId;
    if (courseDocId) {
      const enrollment = await strapi.documents('api::enrollment.enrollment').findFirst({
        filters: {
          student: { id: user.id },
          course: { documentId: courseDocId },
        },
      });

      if (!enrollment) {
        return ctx.forbidden('You must be enrolled in this course to track lesson progress.');
      }
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

    // filter by student if role is Student
    if (roleName === 'Student' || roleType === 'student') {
      filters.student = { id: user.id };
    } else if (roleName === 'Instructor' || roleType === 'instructor') {
      filters.lesson = { course: { owner: { id: user.id } } };
    }

    const [progresses, total] = await Promise.all([
      strapi.documents('api::lesson-progress.lesson-progress').findMany({
        filters,
        populate: ['lesson', 'student'],
        sort: /** @type {any} */ (sort) || { createdAt: 'desc' },
        start,
        limit,
      }),
      strapi.documents('api::lesson-progress.lesson-progress').count({ filters }),
    ]);

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
