'use strict';

const { errors } = require('@strapi/utils');
const { ForbiddenError, UnauthorizedError } = errors;

module.exports = async (ctx, config, { strapi }) => {
  let { user } = ctx.state;
  if (!user) {
    throw new UnauthorizedError('Authentication is required.');
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

  const isStaff =
    ['Admin', 'Content Manager'].includes(roleName) ||
    ['admin', 'content_manager'].includes(roleType);

  if (!isStaff) {
    throw new ForbiddenError('Access denied. Content Manager or Administrator privileges are required.');
  }

  return true;
};
