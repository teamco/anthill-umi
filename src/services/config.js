/**
 * @export
 * @return {{SERVER_PORT: number, API: string, SERVER_URL: string, ANTHILL_KEY: string}}
 * @constructor
 */
export const API_CONFIG = () => {
  /**
   * API definition
   * @type {{SERVER_URL, SERVER_PORT, API, ANTHILL_KEY}}
   */
  const {
    ANTHILL_KEY = 'anthill-key',
    SERVER_URL = 'http://localhost',
    SERVER_PORT = 3000,
    API = 'api/v1',
  } = process.env;

  return {
    ANTHILL_KEY,
    SERVER_URL,
    SERVER_PORT,
    API,
  };
};

export const API = {
  websites: {
    getWebsite: 'websites/:websiteKey',
    getWebsiteWidgets: 'websites/:websiteKey/widgets',
    updateWebsite: 'websites/:websiteKey',
    saveWebsite: 'websites',
  },
  widgets: {
    getWidget: 'widgets/:widgetKey',
  },
};
