'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::course.course', ({ strapi }) => ({
  async create(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required to create a course.');
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

    return ctx.created({
      data: course,
    });
  },

  async find(ctx) {
    const { populate, sort } = ctx.query || {};

    const courses = await strapi.documents('api::course.course').findMany({
      populate: ['owner', 'lessons', 'quizzes'],
      sort: /** @type {any} */ (sort) || { createdAt: 'desc' },
    });

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
          page: 1,
          pageSize: sanitizedCourses.length,
          pageCount: 1,
          total: sanitizedCourses.length,
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