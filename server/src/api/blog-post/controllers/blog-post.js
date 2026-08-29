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
    const isPublished = payload.isPublished !== undefined 
      ? Boolean(payload.isPublished) 
      : (payload.publishedAt !== null && payload.publishedAt !== undefined);

    const post = await strapi.documents('api::blog-post.blog-post').create({
      data: {
        title: payload.title,
        body: payload.body,
        coverImageUrl: payload.coverImageUrl || '',
        author: authorId,
      },
      status: isPublished ? 'published' : 'draft',
      populate: ['author'],
    });

    return ctx.created({
      data: post,
    });
  },

  async update(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required to update blog post.');
    }

    const { id } = ctx.params;
    const payload = ctx.request.body?.data || ctx.request.body || {};

    let existing = await strapi.documents('api::blog-post.blog-post').findOne({
      documentId: id,
    });
    if (!existing) {
      existing = await strapi.query('api::blog-post.blog-post').findOne({
        where: { id },
      });
    }

    if (!existing) {
      return ctx.notFound('Blog post not found.');
    }

    const docId = String(existing.documentId || existing.id);

    const updateData = {};
    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.body !== undefined) updateData.body = payload.body;
    if (payload.coverImageUrl !== undefined) updateData.coverImageUrl = payload.coverImageUrl;
    if (payload.author !== undefined) updateData.author = payload.author;

    const updated = await strapi.documents('api::blog-post.blog-post').update({
      documentId: docId,
      data: /** @type {any} */ (updateData),
      populate: ['author'],
    });

    if (payload.isPublished === true) {
      try {
        await strapi.documents('api::blog-post.blog-post').publish({ documentId: docId });
      } catch {
        // ignore if already published
      }
    } else if (payload.isPublished === false) {
      try {
        await strapi.documents('api::blog-post.blog-post').unpublish({ documentId: docId });
      } catch {
        // ignore if already unpublished
      }
    }

    const finalPost = await strapi.documents('api::blog-post.blog-post').findOne({
      documentId: docId,
      populate: ['author'],
    });

    return ctx.send({
      data: finalPost || updated,
    });
  },

  async delete(ctx) {
    const { user } = ctx.state;
    if (!user) {
      return ctx.unauthorized('Authentication required to delete blog post.');
    }

    const { id } = ctx.params;
    let existing = await strapi.documents('api::blog-post.blog-post').findOne({
      documentId: id,
    });
    if (!existing) {
      existing = await strapi.query('api::blog-post.blog-post').findOne({
        where: { id },
      });
    }

    if (!existing) {
      return ctx.notFound('Blog post not found.');
    }

    const docId = String(existing.documentId || existing.id);
    await strapi.documents('api::blog-post.blog-post').delete({ documentId: docId });

    return ctx.send({
      message: 'Blog post deleted successfully.',
      data: { documentId: docId, id: existing.id, title: existing.title },
    });
  },

  async find(ctx) {
    const { user } = ctx.state;
    const isStaff =
      user &&
      (['Admin', 'Content Manager'].includes(user.role?.name) ||
        ['admin', 'content_manager'].includes(user.role?.type));

    // Ensure status is properly routed:
    // If not staff, strictly enforce 'published'
    if (!isStaff) {
      ctx.query = {
        ...ctx.query,
        status: 'published',
      };
    } else {
      // If staff and status is not specified or 'all', default to draft (which returns all records)
      if (!ctx.query.status || ctx.query.status === 'all') {
        ctx.query = {
          ...ctx.query,
          status: 'draft',
        };
      }
    }

    const { populate } = ctx.query || {};
    const shouldPopulateAuthor =
      populate === '*' ||
      populate === 'author' ||
      (Array.isArray(populate) && populate.includes('author')) ||
      (typeof populate === 'object' && populate !== null && /** @type {any} */ (populate).author);

    const response = await super.find(ctx);

    if (Array.isArray(response?.data)) {
      const postDocIds = response.data.map((p) => String(p.documentId || p.id));

      let publishedMap = new Map();
      if (isStaff && postDocIds.length > 0) {
        const publishedRows = await strapi.db.query('api::blog-post.blog-post').findMany({
          where: {
            documentId: { $in: postDocIds },
            publishedAt: { $notNull: true },
          },
        });
        publishedMap = new Map(publishedRows.map((r) => [r.documentId, r.publishedAt]));
      }

      let authorMap = new Map();
      if (shouldPopulateAuthor && postDocIds.length > 0) {
        const postsWithAuthors = await strapi.db.query('api::blog-post.blog-post').findMany({
          where: {
            documentId: { $in: postDocIds },
          },
          populate: ['author'],
        });
        authorMap = new Map(postsWithAuthors.map((p) => [p.documentId, p.author]));
      }

      response.data.forEach((p) => {
        if (isStaff) {
          p.publishedAt = publishedMap.get(p.documentId) || null;
        }

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
    const { user } = ctx.state;
    const isStaff =
      user &&
      (['Admin', 'Content Manager'].includes(user.role?.name) ||
        ['admin', 'content_manager'].includes(user.role?.type));

    if (!isStaff) {
      ctx.query = {
        ...ctx.query,
        status: 'published',
      };
    } else {
      if (!ctx.query.status) {
        ctx.query = {
          ...ctx.query,
          status: 'draft',
        };
      }
    }

    const { id } = ctx.params;
    const response = await super.findOne(ctx);

    if (response?.data) {
      const docId = response.data.documentId || id;

      if (isStaff) {
        const dbRecord = await strapi.db.query('api::blog-post.blog-post').findOne({
          where: {
            $or: [{ documentId: docId }, { id: docId }],
            publishedAt: { $notNull: true },
          },
        });
        response.data.publishedAt = dbRecord?.publishedAt || null;
      }

      const postWithAuthor = await strapi.db.query('api::blog-post.blog-post').findOne({
        where: {
          $or: [{ documentId: docId }, { id: docId }],
        },
        populate: ['author'],
      });

      if (postWithAuthor?.author) {
        response.data.author = {
          id: postWithAuthor.author.id,
          documentId: postWithAuthor.author.documentId,
          username: postWithAuthor.author.username,
          email: postWithAuthor.author.email,
        };
      }
    }

    return response;
  },
}));
