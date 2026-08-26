'use strict';

module.exports = async (ctx, config, { strapi }) => {
  let { user } = ctx.state;
  if (!user) return false;

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
  return (
    ['Admin', 'Content Manager', 'Instructor'].includes(roleName) ||
    ['admin', 'content_manager', 'instructor'].includes(roleType)
  );
};
