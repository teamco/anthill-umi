/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { getEmbedCode } from '@/vendors/widgets/YouTube/services/youtube.service';

const DEFAULTS = {
  text: '',
  embedUrl: 'https://www.youtube.com/embed/ALZHF5UqnU4'
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'youtubeModel',
  state: {
    defaults: {},
    previewUrl: false
  },
  effects: {

    * setProperties({ payload }, { put }) {
      const {
        embedUrl = DEFAULTS['embedUrl'],
        properties,
        contentKey
      } = payload;

      yield put({
        type: 'contentModel/setContentProperties',
        payload: {
          model: 'youtubeModel',
          contentKey,
          propsModal: properties,
          source: 'youtube',
          contentForm: {
            ...DEFAULTS,
            previewUrl: getEmbedCode(embedUrl),
            embedUrl
          }
        }
      });
    },

    * updatePreview({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          previewUrl: getEmbedCode(payload.previewUrl)
        }
      });
    }
  },
  reducers: {}
});
