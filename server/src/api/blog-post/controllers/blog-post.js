'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog-post.blog-post', ({ strapi }) => ({
  async create(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required to create blog post.');
    }

    const payload = ctx.request.body?.data || ctx.request.body || {};

    const authorId = payload.author || user.id;

    const post = await strapi.documents('api::blog-post.blog-post').create({
      data: {
        ...payload,
        author: authorId,
      },
      populate: ['author'],
    });

    return ctx.created({
      data: post,
    });
  },

  async find(ctx) {
    const { user } = ctx.state;
    const isStaff =
      user &&
      (['Admin', 'Content Manager'].includes(user.role?.name) ||
        ['admin', 'content_manager'].includes(user.role?.type));

    // if not staff, ensure only published posts are returned
    if (!isStaff) {
      const existingFilters =
        typeof ctx.query?.filters === 'object' && ctx.query.filters !== null
          ? ctx.query.filters
          : {};

      ctx.query = {
        ...ctx.query,
        filters: {
          ...existingFilters,
          publishedAt: { $notNull: true },
        },
      };
    }

    const { populate } = ctx.query || {};
    const shouldPopulateAuthor =
      populate === '*' ||
      populate === 'author' ||
      (Array.isArray(populate) && populate.includes('author')) ||
      (typeof populate === 'object' && populate !== null && /** @type {any} */ (populate).author);

    const response = await super.find(ctx);

    if (shouldPopulateAuthor && Array.isArray(response?.data)) {
      const postDocIds = response.data.map((p) => p.documentId || p.id);
      const postsWithAuthors = await strapi.db.query('api::blog-post.blog-post').findMany({
        where: {
          documentId: { $in: postDocIds },
        },
        populate: ['author'],
      });
      const authorMap = new Map(postsWithAuthors.map((p) => [p.documentId, p.author]));

      response.data.forEach((p) => {
        const author = authorMap.get(p.documentId);
        if (author) {
          p.author = {
            id: author.id,
            documentId: author.documentId,
            username: author.username,
            email: author.email,
          };
        }
      });
    }

    return response;
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await super.findOne(ctx);

    if (response?.data) {
      const post = await strapi.db.query('api::blog-post.blog-post').findOne({
        where: {
          $or: [{ documentId: id }, { id }],
        },
        populate: ['author'],
      });
      if (post?.author) {
        response.data.author = {
          id: post.author.id,
          documentId: post.author.documentId,
          username: post.author.username,
          email: post.author.email,
        };
      }
    }

    return response;
  },
}));
