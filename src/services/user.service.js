import i18n from '@/utils/i18n';
import request from '@/utils/request';
import { API } from '@/services/config';
import { errorGetMsg } from '@/utils/message';
import { getXHRToken } from '@/services/auth.service';
import gravatar from 'gravatar.js';

/**
 * @export
 * @param {{metadata:{roles:{superadmin_role}}}} user
 * @return {*}
 */
export const isAdmin = (user) => {
  return user?.metadata?.roles?.superadmin_role;
};

/**
 * @export
 * @param {{metadata:{roles:{supervisor_role}}}} user
 * @return {*}
 */
export const isModerator = (user) => {
  return user?.metadata?.roles?.supervisor_role;
};

/**
 * @export
 * @param token
 * @return {Q.Promise<*>|undefined}
 */
export function getCurrentUser({ token }) {
  console.log('>>>', getXHRToken({ token }));
  const opts = request.config({
    url: API.auth.currentUser,
    headers: { 'Authorization': getXHRToken({ token }) }
  });

  return request.xhr(opts,
      (error) => errorGetMsg(i18n.t('instance:user'), error),
      '/home'
  );
}

/**
 * @export
 * @param id
 * @param token
 * @return {Q.Promise<*>|undefined}
 */
export function getUser({ userKey, token }) {
  const opts = request.config({
    url: API.users.getUser,
    headers: { 'Authorization': getXHRToken({ token }) },
    userKey
  });

  return request.xhr(opts,
      (error) => errorGetMsg(i18n.t('instance:user'), error),
      '/home'
  );
}

/**
 * @export
 * @param {string} email
 * @param {string} protocol
 * @param {string} format
 * @return {*}
 */
export function getProfileImage({ email, protocol = 'http', format = 'json' }) {
  return gravatar.url(email, { protocol, format });
}
