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
      const existingCourseFilters =
        typeof filters.course === 'object' && filters.course !== null ? filters.course : {};
      filters.course = {
        ...existingCourseFilters,
        owner: { id: user.id },
      };
    }

    const [enrollments, total] = await Promise.all([
      strapi.documents('api::enrollment.enrollment').findMany({
        filters,
        populate: {
          course: {
            populate: ['lessons', 'quizzes'],
          },
          student: true,
        },
        sort: /** @type {any} */ (sort) || { createdAt: 'desc' },
        start,
        limit,
      }),
      strapi.documents('api::enrollment.enrollment').count({ filters }),
    ]);

    const activeEnrollments = enrollments.filter((e) => e.course !== null && e.course !== undefined);

    const sanitizedEnrollments = await Promise.all(
      activeEnrollments.map(async (e) => {
        const studentId = e.student?.id || user.id;
        const lessons = e.course?.lessons || [];
        const quizzes = e.course?.quizzes || [];
        const totalLessons = lessons.length;
        const totalQuizzes = quizzes.length;

        let completedLessons = 0;
        let completedQuizzes = 0;

        if (totalLessons > 0) {
          const lessonDocIds = lessons.map((l) => String(l.documentId || l.id));
          const progressCount = await strapi.documents('api::lesson-progress.lesson-progress').count({
            filters: {
              student: { id: studentId },
              lesson: { documentId: { $in: lessonDocIds } },
              completed: true,
            },
          });
          completedLessons = progressCount;
        }

        if (totalQuizzes > 0) {
          const quizDocIds = quizzes.map((q) => String(q.documentId || q.id));
          const resultCount = await strapi.documents('api::quiz-result.quiz-result').count({
            filters: {
              student: { id: studentId },
              quiz: { documentId: { $in: quizDocIds } },
            },
          });
          completedQuizzes = resultCount;
        }

        const isLessonsCompleted = totalLessons === 0 || completedLessons >= totalLessons;
        const isQuizzesCompleted = totalQuizzes === 0 || completedQuizzes >= totalQuizzes;
        const isCompleted = isLessonsCompleted && isQuizzesCompleted;

        const totalItems = totalLessons + totalQuizzes;
        const completedItems = completedLessons + completedQuizzes;
        const progressPercentage = totalItems > 0 ? Math.min(100, Math.round((completedItems / totalItems) * 100)) : 0;

        return {
          id: e.id,
          documentId: e.documentId,
          enrolledAt: e.enrolledAt,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
          publishedAt: e.publishedAt,
          isCompleted,
          completedLessons,
          totalLessons,
          completedQuizzes,
          totalQuizzes,
          progressPercentage,
          course: e.course
            ? {
                id: e.course.id,
                documentId: e.course.documentId,
                title: e.course.title,
                description: e.course.description,
                lessons: e.course.lessons || [],
                quizzes: e.course.quizzes || [],
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
        };
      })
    );

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
      populate: {
        course: {
          populate: ['lessons', 'quizzes'],
        },
        student: true,
      },
    });

    if (!enrollment) {
      enrollment = await strapi.db.query('api::enrollment.enrollment').findOne({
        where: { id },
        populate: {
          course: {
            populate: ['lessons', 'quizzes'],
          },
          student: true,
        },
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

    const studentId = enrollment.student?.id || user.id;
    const lessons = enrollment.course?.lessons || [];
    const quizzes = enrollment.course?.quizzes || [];
    const totalLessons = lessons.length;
    const totalQuizzes = quizzes.length;

    let completedLessons = 0;
    let completedQuizzes = 0;

    if (totalLessons > 0) {
      const lessonDocIds = lessons.map((l) => String(l.documentId || l.id));
      const progressCount = await strapi.documents('api::lesson-progress.lesson-progress').count({
        filters: {
          student: { id: studentId },
          lesson: { documentId: { $in: lessonDocIds } },
          completed: true,
        },
      });
      completedLessons = progressCount;
    }

    if (totalQuizzes > 0) {
      const quizDocIds = quizzes.map((q) => String(q.documentId || q.id));
      const resultCount = await strapi.documents('api::quiz-result.quiz-result').count({
        filters: {
          student: { id: studentId },
          quiz: { documentId: { $in: quizDocIds } },
        },
      });
      completedQuizzes = resultCount;
    }

    const isLessonsCompleted = totalLessons === 0 || completedLessons >= totalLessons;
    const isQuizzesCompleted = totalQuizzes === 0 || completedQuizzes >= totalQuizzes;
    const isCompleted = isLessonsCompleted && isQuizzesCompleted;

    const totalItems = totalLessons + totalQuizzes;
    const completedItems = completedLessons + completedQuizzes;
    const progressPercentage = totalItems > 0 ? Math.min(100, Math.round((completedItems / totalItems) * 100)) : 0;

    return ctx.send({
      data: {
        id: enrollment.id,
        documentId: enrollment.documentId,
        enrolledAt: enrollment.enrolledAt,
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt,
        publishedAt: enrollment.publishedAt,
        isCompleted,
        completedLessons,
        totalLessons,
        completedQuizzes,
        totalQuizzes,
        progressPercentage,
        course: enrollment.course
          ? {
              id: enrollment.course.id,
              documentId: enrollment.course.documentId,
              title: enrollment.course.title,
              description: enrollment.course.description,
              lessons: enrollment.course.lessons || [],
              quizzes: enrollment.course.quizzes || [],
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
