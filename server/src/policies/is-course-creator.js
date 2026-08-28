'use strict';

const { errors } = require('@strapi/utils');
const { ForbiddenError, UnauthorizedError } = errors;

module.exports = async (ctx, config, { strapi }) => {
  let { user } = ctx.state;
  if (!user) {
    throw new UnauthorizedError('Authentication is required to create a course.');
  }

  if (!user.role || typeof user.role === 'number' || typeof user.role === 'string') {
    user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
      populate: ['role'],
    });
    ctx.state.user = user;
  }

  const roleName = user.role?.name || '';
  const roleType = user.role?.type || '';

  // admin, content manager, and instructor can create courses
  const canCreate =
    ['Admin', 'Content Manager', 'Instructor'].includes(roleName) ||
    ['admin', 'content_manager', 'instructor'].includes(roleType);

  if (!canCreate) {
    throw new ForbiddenError('Only instructors, content managers, and administrators are permitted to create courses.');
  }

  return true;
};
