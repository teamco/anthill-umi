/**
 * @export
 * @return {{
 *  ANTHILL_KEY,
 *  SERVER_URL,
 *  ADMIN_URL,
 *  UI_URL,
 *  SERVER_PORT,
 *  ADMIN_PORT,
 *  UI_PORT,
 *  API
 * }}
 * @constant
 */
export const API_CONFIG = () => {

  /**
   * API definition
   * @type {{
   *  ANTHILL_KEY,
   *  SERVER_URL,
   *  ADMIN_URL,
   *  UI_URL,
   *  SERVER_PORT,
   *  ADMIN_PORT,
   *  UI_PORT,
   *  API
   * }}
   */
  const {
    ANTHILL_KEY = 'anthill-key',
    SERVER_URL = 'http://localhost',
    ADMIN_URL = 'http://localhost',
    UI_URL = 'http://localhost',
    SERVER_PORT = 3000,
    ADMIN_PORT = 8001,
    UI_PORT = 8002,
    API = 'api/v1'
  } = process.env;

  return {
    ANTHILL_KEY,
    SERVER_URL,
    ADMIN_URL,
    UI_URL,
    SERVER_PORT,
    ADMIN_PORT,
    UI_PORT,
    API
  };
};

export const API = {
  auth: {
    getToken: 'auth',
    currentUser: 'current_user'
  },
  users: {
    getUser: 'users/:userKey'
  },
  websites: {
    getWebsite: 'users/:userKey/websites/:websiteKey',
    getWebsiteWidgets: 'users/:userKey/websites/:websiteKey/widgets',
    updateWebsite: 'users/:userKey/websites/:websiteKey',
    saveWebsite: 'websites'
  },
  widgets: {
    getWidget: 'widgets/:widgetKey'
  }
};
