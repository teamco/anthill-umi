import { API } from '@/services/config';
import request from '@/utils/request';
import i18n from '@/utils/i18n';
import { errorGetMsg } from '@/utils/message';
import { getXHRToken } from '@/services/auth.service';

/**
 * @export
 * @param key
 * @return {*}
 */
export function getWebsite({ key }) {
  const opts = request.config({
    url: API.websites.getWebsite,
    websiteKey: key
  });

  return request.xhr(opts, () => errorGetMsg(i18n.t('instance:website')));
}

/**
 * @export
 * @param token
 * @param websiteKey
 * @param userKey
 * @return {Q.Promise<*>|undefined}
 */
export function getAssignedWidgets({ token, websiteKey, userKey }) {
  const opts = request.config({
    url: API.websites.getWebsiteWidgets,
    headers: { 'Authorization': getXHRToken({ token }) },
    websiteKey,
    userKey
  });

  return request.xhr(opts, () => errorGetMsg(i18n.t('instance:website')));
}
