export default [
  {
    method: 'GET',
    path: '/tabs',
    handler: 'myController.tabs',
    config: {
      policies: [],
      auth: false, // !! No authentication for this endpoint !!
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: 'myController.find',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'GET',
    path: '/:id',
    handler: 'myController.findOne',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'POST',
    path: '/',
    handler: 'myController.create',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    }
  },
  {
    method: 'PUT',
    path: '/:id',
    handler: 'myController.update',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    }
  },
  {
    method: 'DELETE',
    path: '/:id',
    handler: 'myController.delete',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],  
    }
  }
];
