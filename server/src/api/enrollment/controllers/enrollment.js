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

    // filter by student
    if (roleName === 'Student' || roleType === 'student') {
      filters.student = { id: user.id };
    } else if (roleName === 'Instructor' || roleType === 'instructor') {
      filters.course = { owner: { id: user.id } };
    }

    const [enrollments, total] = await Promise.all([
      strapi.documents('api::enrollment.enrollment').findMany({
        filters,
        populate: ['course', 'student'],
        sort: /** @type {any} */ (sort) || { createdAt: 'desc' },
        start,
        limit,
      }),
      strapi.documents('api::enrollment.enrollment').count({ filters }),
    ]);

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
