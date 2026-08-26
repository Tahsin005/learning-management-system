'use strict';

module.exports = async (ctx, config, { strapi }) => {
  let { user } = ctx.state;
  if (!user) return false;

  // ensure role is populated
  if (!user.role || typeof user.role === 'number' || typeof user.role === 'string') {
    user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
      populate: ['role'],
    });
    ctx.state.user = user;
  }

  const roleName = user.role?.name || '';
  const roleType = user.role?.type || '';

  // admin & content manager have full access
  if (['Admin', 'Content Manager'].includes(roleName) || ['admin', 'content_manager'].includes(roleType)) {
    return true;
  }

  // instructor must own the course
  if (roleName === 'Instructor' || roleType === 'instructor') {
    const { id } = ctx.params;
    if (!id) return false;

    let course = await strapi.documents('api::course.course').findOne({
      documentId: id,
      populate: ['owner'],
    });

    if (!course) {
      course = await strapi.query('api::course.course').findOne({
        where: { id },
        populate: ['owner'],
      });
    }

    return course?.owner?.id === user.id;
  }

  return false;
};