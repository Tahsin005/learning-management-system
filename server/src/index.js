'use strict';

// ensures a role exists and returns it

async function ensureRole(strapi, { name, type, description }) {
  let role = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type },
  });

  if (!role) {
    role = await strapi.query('plugin::users-permissions.role').findOne({
      where: { name },
    });
  }

  if (!role) {
    role = await strapi.query('plugin::users-permissions.role').create({
      data: {
        name,
        type,
        description,
      },
    });
    strapi.log.info(`[Bootstrap] Created role: ${name}`);
  }

  return role;
}

// grants an array of action strings to a specific role ID
async function grantPermissions(strapi, roleId, actions) {
  for (const action of actions) {
    const existing = await strapi.query('plugin::users-permissions.permission').findOne({
      where: {
        role: roleId,
        action,
      },
    });

    if (!existing) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action,
          role: roleId,
        },
      });
    }
  }
}

module.exports = {
  register(/*{ strapi }*/) { },

  async bootstrap({ strapi }) {
    try {
      // ensure roles exist
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      const adminRole = await ensureRole(strapi, {
        name: 'Admin',
        type: 'admin',
        description: 'Platform Administrator with full control',
      });

      const contentManagerRole = await ensureRole(strapi, {
        name: 'Content Manager',
        type: 'content_manager',
        description: 'Manages courses, lessons, and blog posts',
      });

      const instructorRole = await ensureRole(strapi, {
        name: 'Instructor',
        type: 'instructor',
        description: 'Manages own courses, lessons, quizzes, and student progress',
      });

      const studentRole = await ensureRole(strapi, {
        name: 'Student',
        type: 'student',
        description: 'Enrolls in courses, views lessons, takes quizzes, and tracks own progress',
      });

      // define action sets
      const publicActions = [
        'api::course.course.find',
        'api::course.course.findOne',
        'api::blog-post.blog-post.find',
        'api::blog-post.blog-post.findOne',
        'api::global.global.find',
        'api::about.about.find',
      ];

      const commonAuthActions = [
        'plugin::users-permissions.user.me',
        'plugin::users-permissions.auth.changePassword',
        'plugin::users-permissions.auth.logout',
        'plugin::users-permissions.auth.getSessions',
        'plugin::users-permissions.auth.revokeSession',
      ];

      const studentActions = [
        ...publicActions,
        ...commonAuthActions,
        'api::course.course.progress',
        'api::lesson.lesson.find',
        'api::lesson.lesson.findOne',
        'api::quiz.quiz.find',
        'api::quiz.quiz.findOne',
        'api::enrollment.enrollment.find',
        'api::enrollment.enrollment.findOne',
        'api::enrollment.enrollment.create',
        'api::lesson-progress.lesson-progress.find',
        'api::lesson-progress.lesson-progress.findOne',
        'api::lesson-progress.lesson-progress.create',
        'api::lesson-progress.lesson-progress.update',
        'api::quiz-result.quiz-result.find',
        'api::quiz-result.quiz-result.findOne',
        'api::quiz-result.quiz-result.create',
        'api::quiz-result.quiz-result.submit',
      ];

      const instructorActions = [
        ...publicActions,
        ...commonAuthActions,
        'api::course.course.create',
        'api::course.course.update',
        'api::course.course.delete',
        'api::lesson.lesson.find',
        'api::lesson.lesson.findOne',
        'api::lesson.lesson.create',
        'api::lesson.lesson.update',
        'api::lesson.lesson.delete',
        'api::quiz.quiz.find',
        'api::quiz.quiz.findOne',
        'api::quiz.quiz.create',
        'api::quiz.quiz.update',
        'api::quiz.quiz.delete',
        'api::enrollment.enrollment.find',
        'api::enrollment.enrollment.findOne',
        'api::lesson-progress.lesson-progress.find',
        'api::lesson-progress.lesson-progress.findOne',
        'api::quiz-result.quiz-result.find',
        'api::quiz-result.quiz-result.findOne',
      ];

      const contentManagerActions = [
        ...instructorActions,
        'api::blog-post.blog-post.create',
        'api::blog-post.blog-post.update',
        'api::blog-post.blog-post.delete',
      ];

      const adminActions = [
        ...contentManagerActions,
        'api::admin-custom.admin-custom.getStats',
        'api::admin-custom.admin-custom.getUsers',
        'api::admin-custom.admin-custom.updateUserRole',
        'plugin::users-permissions.user.find',
        'plugin::users-permissions.user.findOne',
        'plugin::users-permissions.user.update',
        'plugin::users-permissions.user.destroy',
      ];

      // grant permissions to each role
      if (publicRole) await grantPermissions(strapi, publicRole.id, publicActions);
      if (studentRole) await grantPermissions(strapi, studentRole.id, studentActions);
      if (instructorRole) await grantPermissions(strapi, instructorRole.id, instructorActions);
      if (contentManagerRole) await grantPermissions(strapi, contentManagerRole.id, contentManagerActions);
      if (adminRole) await grantPermissions(strapi, adminRole.id, adminActions);

      strapi.log.info('[Bootstrap] LMS Roles and Permissions initialized successfully.');
    } catch (error) {
      strapi.log.error('[Bootstrap] Failed to initialize roles and permissions:', error);
    }
  },
};
