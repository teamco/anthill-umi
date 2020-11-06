const axios = require('axios');

/**
 * @type {{SERVER_URL, SERVER_PORT}}
 */
const {
  SERVER_URL = 'http://localhost',
  SERVER_PORT = 5000
} = process.env;

/**
 * @function
 * @return {string}
 * @private
 */
function _csrfParam() {
  const meta = document.querySelector('meta[name="csrf-param"]');
  return meta.getAttribute('content');
}

/**
 * @function
 * @return {string}
 * @private
 */
function _csrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta.getAttribute('content');
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*',
  accept: 'application/json'
};

const mergeHeaders = () => {
  // DEFAULT_HEADERS['X-CSRF-Token'] = _csrfToken();
  return DEFAULT_HEADERS;
};

/**
 * @function
 * @param url
 * @param key
 * @return {*}
 */
function adaptUrl(url, key) {
  return url.replace(/:id/, key);
}

/**
 * @function
 * @param {string} url
 * @param {string} [method]
 * @param [headers]
 * @param [args]
 * @return {{headers, method: string, url: *}}
 */
function config({url, method = 'get', headers = {}, ...args}) {
  if (url.match(/:id/)) {
    url = adaptUrl(url, args.key);
  }

  return {
    ...{
      url: `${SERVER_URL}:${SERVER_PORT}/${url}`,
      method,
      responseType: 'json',
      headers: {...mergeHeaders(), ...headers}
    },
    ...args
  };
}

/**
 * @function
 * @param file
 * @return {Promise<unknown>}
 */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * @function
 * @param opts
 * @param [errorMsg]
 * @param [fallbackUrl]
 * @return {Q.Promise<any> | undefined}
 */
function xhr(opts, errorMsg, fallbackUrl) {
  return axios(opts).catch(() => {
    errorMsg && errorMsg();
    setTimeout(() => {
      debugger
      // fallbackUrl && (window.location.href = fallbackUrl);
    }, 2000);
  });
}

/**
 * @function
 * @param status
 * @return {boolean}
 */
function isSuccess(status) {
  return [200, 201, 202, 203, 204].indexOf(status) > -1;
}

export default {
  xhr,
  config,
  toBase64,
  isSuccess
};
