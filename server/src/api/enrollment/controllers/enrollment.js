'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::enrollment.enrollment', ({ strapi }) => ({
  async create(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required to enroll.');
    }

    const roleName = user.role?.name || '';
    const roleType = user.role?.type || '';

    // only students can enroll per the permission matrix
    if (roleName !== 'Student' && roleType !== 'student' && roleName !== 'Admin' && roleType !== 'admin') {
      return ctx.forbidden('Only students can enroll in courses.');
    }

    const payload = ctx.request.body?.data || ctx.request.body;
    const courseTarget = payload?.course;

    if (!courseTarget) {
      return ctx.badRequest('Course identifier is required for enrollment.');
    }

    const courseDocId =
      typeof courseTarget === 'object'
        ? courseTarget.documentId || courseTarget.id
        : courseTarget;

    // check if course exists
    let course = await strapi.documents('api::course.course').findOne({
      documentId: courseDocId,
    });

    if (!course) {
      course = await strapi.query('api::course.course').findOne({
        where: { id: courseDocId },
      });
    }

    if (!course) {
      return ctx.notFound('Course not found.');
    }

    // check for existing enrollment
    const existingEnrollment = await strapi.documents('api::enrollment.enrollment').findFirst({
      filters: {
        student: { id: user.id },
        course: { documentId: course.documentId || courseDocId },
      },
    });

    if (existingEnrollment) {
      return ctx.send({
        message: 'Already enrolled in this course.',
        data: existingEnrollment,
      });
    }

    const enrollment = await strapi.documents('api::enrollment.enrollment').create({
      data: {
        student: user.id,
        course: course.documentId || course.id,
        enrolledAt: new Date(),
      },
      populate: ['course', 'student'],
    });

    return ctx.created({
      message: 'Successfully enrolled in course.',
      data: enrollment,
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

    // filter by student
    if (roleName === 'Student' || roleType === 'student') {
      filters.student = { id: user.id };
    } else if (roleName === 'Instructor' || roleType === 'instructor') {
      filters.course = { owner: { id: user.id } };
    }

    const enrollments = await strapi.documents('api::enrollment.enrollment').findMany({
      filters,
      populate: ['course', 'student'],
      sort: { createdAt: 'desc' },
    });

    const sanitizedEnrollments = enrollments.map((e) => ({
      id: e.id,
      documentId: e.documentId,
      enrolledAt: e.enrolledAt,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      publishedAt: e.publishedAt,
      course: e.course
        ? {
            id: e.course.id,
            documentId: e.course.documentId,
            title: e.course.title,
            description: e.course.description,
          }
        : null,
      student: e.student
        ? {
            id: e.student.id,
            documentId: e.student.documentId,
            username: e.student.username,
            email: e.student.email,
          }
        : null,
    }));

    return ctx.send({
      data: sanitizedEnrollments,
      meta: {
        pagination: {
          page: 1,
          pageSize: sanitizedEnrollments.length,
          pageCount: 1,
          total: sanitizedEnrollments.length,
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
    let enrollment = await strapi.documents('api::enrollment.enrollment').findOne({
      documentId: id,
      populate: ['course', 'student'],
    });

    if (!enrollment) {
      enrollment = await strapi.db.query('api::enrollment.enrollment').findOne({
        where: { id },
        populate: ['course', 'student'],
      });
    }

    if (!enrollment) {
      return ctx.notFound('Enrollment not found.');
    }

    const roleName = user.role?.name || '';
    const roleType = user.role?.type || '';

    if ((roleName === 'Student' || roleType === 'student') && enrollment.student?.id !== user.id) {
      return ctx.forbidden('Access denied.');
    }

    return ctx.send({
      data: {
        id: enrollment.id,
        documentId: enrollment.documentId,
        enrolledAt: enrollment.enrolledAt,
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt,
        publishedAt: enrollment.publishedAt,
        course: enrollment.course
          ? {
              id: enrollment.course.id,
              documentId: enrollment.course.documentId,
              title: enrollment.course.title,
              description: enrollment.course.description,
            }
          : null,
        student: enrollment.student
          ? {
              id: enrollment.student.id,
              documentId: enrollment.student.documentId,
              username: enrollment.student.username,
              email: enrollment.student.email,
            }
          : null,
      },
    });
  },
}));
