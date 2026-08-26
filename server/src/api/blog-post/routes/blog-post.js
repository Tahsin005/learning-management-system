'use strict';

/**
 * blog-post router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::blog-post.blog-post', {
  config: {
    create: { policies: ['global::is-content-manager-or-admin'] },
    update: { policies: ['global::is-content-manager-or-admin'] },
    delete: { policies: ['global::is-content-manager-or-admin'] },
  },
});
