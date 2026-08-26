'use strict';

/**
 * course router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::course.course', {
  config: {
    create: { policies: ['global::is-course-creator'] },
    update: { policies: ['global::is-course-owner'] },
    delete: { policies: ['global::is-course-owner'] },
  },
});