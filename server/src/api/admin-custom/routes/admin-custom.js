'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/admin-custom/stats',
      handler: 'admin-custom.getStats',
      config: {
        policies: ['global::is-admin'],
      },
    },
    {
      method: 'GET',
      path: '/admin-custom/users',
      handler: 'admin-custom.getUsers',
      config: {
        policies: ['global::is-admin'],
      },
    },
    {
      method: 'PUT',
      path: '/admin-custom/users/:id/role',
      handler: 'admin-custom.updateUserRole',
      config: {
        policies: ['global::is-admin'],
      },
    },
  ],
};
