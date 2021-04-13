export const API = {
  websites: {
    getAllWebsites: 'websites',
    getWebsite: 'websites/:id',
    getWebsiteWidgets: 'websites/:id/widgets',
    saveWebsiteWidgets: 'websites/:id/widgets',
    updateWebsite: 'websites/:id',
    destroyWebsite: 'websites/:id',
    saveWebsite: 'websites',
  },
  widgets: {
    getAllWidgets: 'widgets',
    getWidget: 'widgets/:id',
    updateWidget: 'widgets/:id',
    destroyWidget: 'widgets/:id',
    saveWidget: 'widgets',
  },
};
