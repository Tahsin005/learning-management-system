'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/quiz-results/submit',
      handler: 'quiz-result.submit',
      config: {
        policies: [],
      },
    },
  ],
};
