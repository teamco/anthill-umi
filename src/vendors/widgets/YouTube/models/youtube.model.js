/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { getEmbedCode } from '@/vendors/widgets/YouTube/services/youtube.service';

const DEFAULTS = {
  'youtube/embedUrl': 'https://www.youtube.com/embed/ALZHF5UqnU4'
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'youtubeModel',
  state: {
    defaults: {},
    youtubePreview: false
  },
  effects: {

    * setProperties({ payload }, { put }) {
      const {
        embedUrl = DEFAULTS['youtube/embedUrl'],
        properties,
        contentKey
      } = payload;

      yield put({
        type: 'contentModel/setContentProperties',
        payload: {
          model: 'youtubeModel',
          contentKey,
          propsModal: properties,
          contentForm: {
            ...DEFAULTS,
            youtubePreview: getEmbedCode(embedUrl),
            'youtube/embedUrl': embedUrl
          }
        }
      });
    },

    * updatePreview({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          youtubePreview: getEmbedCode(payload.youtubePreview)
        }
      });
    }
  },
  reducers: {}
});
