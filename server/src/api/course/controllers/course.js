'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::course.course', ({ strapi }) => ({
  async create(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required to create a course.');
    }

    const roleName = user.role?.name || '';
    const roleType = user.role?.type || '';
    const canCreate =
      ['Admin', 'Content Manager', 'Instructor'].includes(roleName) ||
      ['admin', 'content_manager', 'instructor'].includes(roleType);

    if (!canCreate) {
      return ctx.forbidden('Only instructors, content managers, and administrators can create courses.');
    }

    const payload = ctx.request.body?.data || ctx.request.body || {};

    let ownerId = payload.owner;
    if (!ownerId || user.role?.name === 'Instructor' || user.role?.type === 'instructor') {
      ownerId = user.id;
    }

    const course = await strapi.documents('api::course.course').create({
      data: {
        ...payload,
        owner: ownerId,
      },
      populate: ['owner'],
    });

    const sanitizedCourse = {
      ...course,
      owner: course.owner
        ? {
            id: course.owner.id,
            documentId: course.owner.documentId,
            username: course.owner.username,
            email: course.owner.email,
          }
        : null,
    };

    return ctx.created({
      data: sanitizedCourse,
    });
  },

  async find(ctx) {
    const { populate, sort, filters = {} } = ctx.query || {};

    /** @type {Record<string, any>} */
    const pagination = ctx.query && typeof ctx.query.pagination === 'object' && ctx.query.pagination !== null
      ? /** @type {Record<string, any>} */ (ctx.query.pagination)
      : {};

    const page = pagination.page ? Math.max(1, parseInt(pagination.page, 10)) : 1;
    const pageSize = pagination.pageSize ? Math.max(1, parseInt(pagination.pageSize, 10)) : 25;
    const start = pagination.start !== undefined ? Math.max(0, parseInt(pagination.start, 10)) : (page - 1) * pageSize;
    const limit = pagination.limit !== undefined ? Math.max(1, parseInt(pagination.limit, 10)) : pageSize;

    const queryFilters = typeof filters === 'object' && filters !== null ? filters : {};

    const [courses, total] = await Promise.all([
      strapi.documents('api::course.course').findMany({
        filters: queryFilters,
        populate: ['owner', 'lessons', 'quizzes'],
        sort: /** @type {any} */ (sort) || { createdAt: 'desc' },
        start,
        limit,
      }),
      strapi.documents('api::course.course').count({
        filters: queryFilters,
      }),
    ]);

    const sanitizedCourses = courses.map((c) => ({
      id: c.id,
      documentId: c.documentId,
      title: c.title,
      description: c.description,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      publishedAt: c.publishedAt,
      owner: c.owner
        ? {
            id: c.owner.id,
            documentId: c.owner.documentId,
            username: c.owner.username,
            email: c.owner.email,
          }
        : null,
      lessons: c.lessons || [],
      quizzes: c.quizzes || [],
    }));

    return ctx.send({
      data: sanitizedCourses,
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
    const { id } = ctx.params;

    let course = await strapi.documents('api::course.course').findOne({
      documentId: id,
      populate: ['owner', 'lessons', 'quizzes'],
    });

    if (!course) {
      course = await strapi.db.query('api::course.course').findOne({
        where: { id },
        populate: ['owner', 'lessons', 'quizzes'],
      });
    }

    if (!course) {
      return ctx.notFound('Course not found.');
    }

    return ctx.send({
      data: {
        id: course.id,
        documentId: course.documentId,
        title: course.title,
        description: course.description,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        publishedAt: course.publishedAt,
        owner: course.owner
          ? {
              id: course.owner.id,
              documentId: course.owner.documentId,
              username: course.owner.username,
              email: course.owner.email,
            }
          : null,
        lessons: course.lessons || [],
        quizzes: course.quizzes || [],
      },
    });
  },

  async update(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required.');
    }

    const { id } = ctx.params;
    let course = await strapi.documents('api::course.course').findOne({
      documentId: id,
      populate: ['owner'],
    });

    if (!course) {
      course = await strapi.query('api::course.course').findOne({
        where: { id },
        populate: ['owner'],
      });
    }

    if (!course) {
      return ctx.notFound('Course not found.');
    }

    const roleName = user.role?.name || '';
    const roleType = user.role?.type || '';

    const canManage =
      ['Admin', 'Content Manager'].includes(roleName) ||
      ['admin', 'content_manager'].includes(roleType) ||
      course.owner?.id === user.id;

    if (!canManage) {
      return ctx.forbidden('You do not have permission to modify this course. You can only manage courses you own.');
    }

    return super.update(ctx);
  },

  async delete(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required.');
    }

    const { id } = ctx.params;
    let course = await strapi.documents('api::course.course').findOne({
      documentId: id,
      populate: ['owner'],
    });

    if (!course) {
      course = await strapi.query('api::course.course').findOne({
        where: { id },
        populate: ['owner'],
      });
    }

    if (!course) {
      return ctx.notFound('Course not found.');
    }

    const roleName = user.role?.name || '';
    const roleType = user.role?.type || '';

    const canManage =
      ['Admin', 'Content Manager'].includes(roleName) ||
      ['admin', 'content_manager'].includes(roleType) ||
      course.owner?.id === user.id;

    if (!canManage) {
      return ctx.forbidden('You do not have permission to delete this course. You can only manage courses you own.');
    }

    return super.delete(ctx);
  },

  async progress(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required to view course progress.');
    }

    const { id } = ctx.params;
    if (!id) {
      return ctx.badRequest('Course ID is required.');
    }

    // find course with lessons
    let course = await strapi.documents('api::course.course').findOne({
      documentId: id,
      populate: ['lessons'],
    });

    if (!course) {
      course = await strapi.query('api::course.course').findOne({
        where: { id },
        populate: ['lessons'],
      });
    }

    if (!course) {
      return ctx.notFound('Course not found.');
    }

    const lessons = course.lessons || [];
    const totalLessons = lessons.length;

    if (totalLessons === 0) {
      return ctx.send({
        courseId: course.documentId || course.id,
        totalLessons: 0,
        completedLessons: 0,
        progressPercentage: 0,
        completedLessonIds: [],
      });
    }

    const lessonDocIds = lessons.map((l) => String(l.documentId || l.id));

    // find all completed progress records for this user and these lessons
    /** @type {any[]} */
    const progresses = await strapi.documents('api::lesson-progress.lesson-progress').findMany({
      filters: {
        student: { id: user.id },
        lesson: { documentId: { $in: lessonDocIds } },
        completed: true,
      },
      populate: ['lesson'],
    });

    const completedLessonIds = progresses
      .filter((p) => p.lesson)
      .map((p) => p.lesson.documentId || p.lesson.id);

    const completedCount = completedLessonIds.length;
    const progressPercentage = Math.min(
      100,
      Math.round((completedCount / totalLessons) * 100)
    );

    return ctx.send({
      courseId: course.documentId || course.id,
      totalLessons,
      completedLessons: completedCount,
      progressPercentage,
      completedLessonIds,
    });
  },
}));