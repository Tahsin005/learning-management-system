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

  const isAdmin = roleName === 'Admin' || roleType === 'admin';
  if (!isAdmin) {
    throw new ForbiddenError('Access denied. Administrator privileges are required to access this resource.');
  }

  return true;
};
