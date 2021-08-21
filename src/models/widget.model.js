/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import {commonModel} from '@/models/common.model';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'widgetModel',
  state: {
    widgets: []
  },
  effects: {
  },
  reducers: {}
});
