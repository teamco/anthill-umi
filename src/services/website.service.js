import {API} from '@/services/config';
import request from '@/utils/request';
import i18n from '@/utils/i18n';
import {errorGetMsg} from '@/utils/message';

/**
 * @export
 * @param key
 * @return {*}
 */
export function getWebsite({key}) {
  const opts = request.config({
    url: API.websites.getWebsite,
    websiteKey: key
  });

  return request.xhr(opts, () => errorGetMsg(i18n.t('instance:website')));
}

/**
 * @export
 * @param key
 * @return {Q.Promise<*>|undefined}
 */
export function getAssignedWidgets({key}) {
  const opts = request.config({
    url: API.websites.getWebsiteWidgets,
    websiteKey: key
  });

  return request.xhr(opts, () => errorGetMsg(i18n.t('instance:website')));
}
