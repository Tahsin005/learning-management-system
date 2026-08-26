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

module.exports = createCoreController('api::lesson.lesson', ({ strapi }) => ({
  async create(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required to create a lesson.');
    }

    const courseTarget = ctx.request.body?.data?.course;
    if (!courseTarget) {
      return ctx.badRequest('Course relation is required when creating a lesson.');
    }

    const courseId = typeof courseTarget === 'object' ? (courseTarget.documentId || courseTarget.id) : courseTarget;
    const canManage = await checkCourseOwnership(strapi, courseId, user.id, user.role);

    if (!canManage) {
      return ctx.forbidden('You do not have permission to add lessons to this course.');
    }

    return super.create(ctx);
  },

  async update(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required.');
    }

    const { id } = ctx.params;
    let lesson = await strapi.documents('api::lesson.lesson').findOne({
      documentId: id,
      populate: ['course.owner'],
    });

    if (!lesson) {
      lesson = await strapi.query('api::lesson.lesson').findOne({
        where: { id },
        populate: ['course.owner'],
      });
    }

    if (!lesson) {
      return ctx.notFound('Lesson not found.');
    }

    const canManage =
      ['Admin', 'Content Manager'].includes(user.role?.name) ||
      ['admin', 'content_manager'].includes(user.role?.type) ||
      lesson.course?.owner?.id === user.id;

    if (!canManage) {
      return ctx.forbidden('You do not have permission to update this lesson.');
    }

    return super.update(ctx);
  },

  async delete(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required.');
    }

    const { id } = ctx.params;
    let lesson = await strapi.documents('api::lesson.lesson').findOne({
      documentId: id,
      populate: ['course.owner'],
    });

    if (!lesson) {
      lesson = await strapi.query('api::lesson.lesson').findOne({
        where: { id },
        populate: ['course.owner'],
      });
    }

    if (!lesson) {
      return ctx.notFound('Lesson not found.');
    }

    const canManage =
      ['Admin', 'Content Manager'].includes(user.role?.name) ||
      ['admin', 'content_manager'].includes(user.role?.type) ||
      lesson.course?.owner?.id === user.id;

    if (!canManage) {
      return ctx.forbidden('You do not have permission to delete this lesson.');
    }

    return super.delete(ctx);
  },

  async findOne(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;

    let lesson = await strapi.documents('api::lesson.lesson').findOne({
      documentId: id,
      populate: ['course.owner'],
    });

    if (!lesson) {
      lesson = await strapi.query('api::lesson.lesson').findOne({
        where: { id },
        populate: ['course.owner'],
      });
    }

    if (!lesson) {
      return ctx.notFound('Lesson not found.');
    }

    // if student is logged in, verify enrollment
    if (user && (user.role?.name === 'Student' || user.role?.type === 'student')) {
      const courseDocId = lesson.course?.documentId;
      if (courseDocId) {
        const enrollment = await strapi.documents('api::enrollment.enrollment').findFirst({
          filters: {
            student: { id: user.id },
            course: { documentId: courseDocId },
          },
        });

        if (!enrollment) {
          return ctx.forbidden('You must be enrolled in this course to view this lesson.');
        }
      }
    }

    return super.findOne(ctx);
  },
}));
