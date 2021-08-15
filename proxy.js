import { API_CONFIG } from './src/services/config';

/**
 * @constant
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
const apiConfig = API_CONFIG();

const railsServer = `${apiConfig.SERVER_URL}:${apiConfig.SERVER_PORT}`;
const uiAdmin = `${apiConfig.ADMIN_URL}:${apiConfig.ADMIN_PORT}`;

/**
 * @constant
 * @param api
 * @return {*}
 */
const proxyOpts = api => ({
  target: api,
  changeOrigin: true,
  cookieDomainRewrite: 'localhost',
  secure: false,

  /**
   * @link https://sdk.gooddata.com/gooddata-ui/docs/4.1.1/ht_configure_webpack_proxy.html
   * @param proxyReq
   * @param req
   * @param res
   */
  onProxyRes(proxyReq, req, res) {
    // Browsers may send Origin headers even with same-origin
    // requests. To prevent CORS issues, we have to change
    // the Origin to match the target URL.
    // if (proxyReq.getHeader('origin')) {
    //   proxyReq.setHeader('origin', api);
    // }
  },
});

const routes = {
  api: railsServer,
  upload: uiAdmin
};

const proxy = {};

Object.keys(routes).forEach((server) => {
  proxy[`/${server}`] = proxyOpts(routes[server]);
});

export default proxy;
