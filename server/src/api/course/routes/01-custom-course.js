'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/courses/:id/progress',
      handler: 'course.progress',
      config: {
        policies: [],
      },
    },
  ],
};
