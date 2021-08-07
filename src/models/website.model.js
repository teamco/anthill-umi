import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common';
import i18n from '@/utils/i18n';

import { getAssignedWidgets } from '@/services/website.service';

import { getWidgets } from '@/services/widget.service';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'websiteModel',
  state: {
    fileList: [],
    websites: [],
    widgets: [],
    assignedWidgets: [],
  },
  subscriptions: {
    setup({ dispatch }) {
      // dispatch({type: 'websitesQuery'});
    },
  },
  effects: {
    *websiteWidgetsQuery({ payload }, { put, call }) {
      const { data } = yield call(getAssignedWidgets, { key: payload.key });
      const allWidgets = yield call(getWidgets);

      const { website, widgets } = data.assigned;

      yield put({
        type: 'toForm',
        payload: {
          model: 'websiteModel',
          entityKey: website.key,
          name: website.name,
        },
      });

      yield put({
        type: 'appModel/activeModel',
        payload: {
          model: 'websiteModel',
          title: i18n.t('website:assignWidgetsTo', { instance: website.name }),
        },
      });

      yield put({
        type: 'updateState',
        payload: {
          assignedWidgets: [...widgets],
          widgets: allWidgets.data,
        },
      });
    },
  },
  reducers: {},
});
