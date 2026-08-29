'use strict';

const formatRole = (role) => {
  if (!role) return null;
  return {
    id: role.id,
    documentId: role.documentId,
    name: role.name,
    description: role.description,
    type: role.type,
  };
};

module.exports = (plugin) => {
  // override 'me'
  plugin.controllers.user.me = async (ctx) => {
    const authUser = ctx.state.user;
    if (!authUser) {
      return ctx.unauthorized();
    }

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: authUser.id },
      populate: ['role'],
    });

    if (!user) {
      return ctx.notFound();
    }

    const schema = strapi.getModel('plugin::users-permissions.user');
    /** @type {Record<string, any>} */
    const sanitizedUser = await strapi.contentAPI.sanitize.output(user, schema, {
      auth: ctx.state.auth,
    });

    if (user.role) {
      sanitizedUser.role = formatRole(user.role);
    }

    ctx.body = sanitizedUser;
  };

  // override 'find'
  plugin.controllers.user.find = async (ctx) => {
    const users = await strapi.db.query('plugin::users-permissions.user').findMany({
      populate: ['role'],
      orderBy: { createdAt: 'desc' },
    });

    const schema = strapi.getModel('plugin::users-permissions.user');
    const sanitizedUsers = await Promise.all(
      users.map(async (user) => {
        /** @type {Record<string, any>} */
        const sanitized = await strapi.contentAPI.sanitize.output(user, schema, {
          auth: ctx.state.auth,
        });
        if (user.role) {
          sanitized.role = formatRole(user.role);
        }
        return sanitized;
      })
    );

    ctx.body = sanitizedUsers;
  };

  // override 'findOne'
  plugin.controllers.user.findOne = async (ctx) => {
    const { id } = ctx.params;
    const isNumeric = !isNaN(Number(id));
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: isNumeric
        ? { $or: [{ id: Number(id) }, { documentId: String(id) }] }
        : { documentId: String(id) },
      populate: ['role'],
    });

    if (!user) {
      return ctx.notFound();
    }

    const schema = strapi.getModel('plugin::users-permissions.user');
    /** @type {Record<string, any>} */
    const sanitizedUser = await strapi.contentAPI.sanitize.output(user, schema, {
      auth: ctx.state.auth,
    });

    if (user.role) {
      sanitizedUser.role = formatRole(user.role);
    }

    ctx.body = sanitizedUser;
  };

  // override 'update'
  plugin.controllers.user.update = async (ctx) => {
    const { id } = ctx.params;
    const { email, username, password, role, ...rest } = ctx.request.body || {};

    const isNumeric = !isNaN(Number(id));
    const existing = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: isNumeric
        ? { $or: [{ id: Number(id) }, { documentId: String(id) }] }
        : { documentId: String(id) },
    });

    if (!existing) {
      return ctx.notFound('User not found');
    }

    const updatePayload = { ...rest };
    if (username) updatePayload.username = username;
    if (email) updatePayload.email = email.toLowerCase();
    if (role) updatePayload.role = role;
    if (password) {
      const bcrypt = require('bcryptjs');
      updatePayload.password = await bcrypt.hash(password, 10);
    }

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: existing.id },
      data: updatePayload,
    });

    const updatedUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: existing.id },
      populate: ['role'],
    });

    const schema = strapi.getModel('plugin::users-permissions.user');
    /** @type {Record<string, any>} */
    const sanitizedUser = await strapi.contentAPI.sanitize.output(updatedUser, schema, {
      auth: ctx.state.auth,
    });

    if (updatedUser?.role) {
      sanitizedUser.role = formatRole(updatedUser.role);
    }

    ctx.body = sanitizedUser;
  };

  return plugin;
};
