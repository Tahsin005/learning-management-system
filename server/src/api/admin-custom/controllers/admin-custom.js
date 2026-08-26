'use strict';

module.exports = {
  async getStats(ctx) {
    const { user } = ctx.state;
    if (!user) return ctx.unauthorized('Authentication required.');

    try {
      // users grouped by role
      const users = await strapi.query('plugin::users-permissions.user').findMany({
        populate: ['role'],
      });

      const usersByRole = {
        admin: 0,
        content_manager: 0,
        instructor: 0,
        student: 0,
        other: 0,
      };

      (users || []).forEach((u) => {
        const type = (u.role?.type || u.role?.name || '')
          .toLowerCase()
          .replace(/\s+/g, '_');
        if (usersByRole[type] !== undefined) {
          usersByRole[type]++;
        } else {
          usersByRole.other++;
        }
      });

      // count documents
      const [totalCourses, totalEnrollments, totalLessons, totalQuizzes] = await Promise.all([
        strapi.documents('api::course.course').count({}),
        strapi.documents('api::enrollment.enrollment').count({}),
        strapi.documents('api::lesson.lesson').count({}),
        strapi.documents('api::quiz.quiz').count({}),
      ]);

      return ctx.send({
        totalUsers: (users || []).length,
        usersByRole,
        totalCourses,
        totalEnrollments,
        totalLessons,
        totalQuizzes,
      });
    } catch (error) {
      strapi.log.error('[AdminCustomController] getStats error:', error);
      return ctx.internalServerError('Failed to aggregate platform statistics.');
    }
  },

  async getUsers(ctx) {
    const { user } = ctx.state;
    if (!user) return ctx.unauthorized('Authentication required.');

    try {
      const users = await strapi.query('plugin::users-permissions.user').findMany({
        populate: ['role'],
        select: ['id', 'documentId', 'username', 'email', 'confirmed', 'blocked', 'createdAt'],
      });

      return ctx.send(users);
    } catch (error) {
      strapi.log.error('[AdminCustomController] getUsers error:', error);
      return ctx.internalServerError('Failed to fetch users.');
    }
  },

  async updateUserRole(ctx) {
    const { user } = ctx.state;
    if (!user) return ctx.unauthorized('Authentication required.');

    const { id } = ctx.params;
    const { roleId, roleType, roleName } = ctx.request.body || {};

    if (!roleId && !roleType && !roleName) {
      return ctx.badRequest('A role identifier (roleId, roleType, or roleName) is required.');
    }

    try {
      // find role
      let targetRole = null;
      if (roleId) {
        targetRole = await strapi.query('plugin::users-permissions.role').findOne({
          where: { id: roleId },
        });
      } else if (roleType) {
        targetRole = await strapi.query('plugin::users-permissions.role').findOne({
          where: { type: roleType },
        });
      } else if (roleName) {
        targetRole = await strapi.query('plugin::users-permissions.role').findOne({
          where: { name: roleName },
        });
      }

      if (!targetRole) {
        return ctx.notFound('Target role not found.');
      }

      // update user
      const updatedUser = await strapi.query('plugin::users-permissions.user').update({
        where: { id },
        data: {
          role: targetRole.id,
        },
        populate: ['role'],
      });

      if (!updatedUser) {
        return ctx.notFound('User not found.');
      }

      return ctx.send({
        message: 'User role updated successfully.',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } catch (error) {
      strapi.log.error('[AdminCustomController] updateUserRole error:', error);
      return ctx.internalServerError('Failed to update user role.');
    }
  },
};
