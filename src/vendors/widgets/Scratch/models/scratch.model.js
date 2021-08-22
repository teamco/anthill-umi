/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { getEmbedCode } from '@/vendors/widgets/YouTube/services/youtube.service';

const DEFAULTS = {};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'scratchModel',
  state: {
    defaults: {}
  },
  effects: {

    * setProperties({ payload }, { put }) {
      const {
        properties,
        contentKey
      } = payload;

      yield put({
        type: 'contentModel/setContentProperties',
        payload: {
          model: 'scratchModel',
          contentKey,
          propsModal: properties,
          source: 'scratch',
          contentForm: { ...DEFAULTS }
        }
      });
    }
  },
  reducers: {}
});
