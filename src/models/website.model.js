import dvaModelExtend from 'dva-model-extend';
import { history } from 'umi';

import { commonModel } from '@/models/common';
import i18n from '@/utils/i18n';
import { fromForm } from '@/utils/state';
import request from '@/utils/request';
import { generateKey } from '@/services/common.service';

import { successDeleteMsg, successSaveMsg } from '@/utils/message';

import {
  destroyWebsite,
  getAssignedWidgets,
  getWebsite,
  getWebsites,
  saveWebsite,
  saveWebsiteWidgets,
  updateWebsite,
} from '@/services/website.service';
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
    *websitesQuery({ payload }, { put, call, take }) {
      const websites = yield call(getWebsites);

      if (payload.global) {
        yield put({
          type: 'appModel/storeForm',
          payload: {
            form: null,
            model: 'websiteModel',
          },
        });

        yield put({
          type: 'appModel/activeModel',
          payload: {
            isEdit: false,
            model: 'websiteModel',
            count: websites.data.length,
            title: i18n.t('model:list', { instance: '$t(menu:websites)' }),
          },
        });

        yield take('appModel/activeModel/@@end');
      }

      yield put({
        type: 'updateState',
        payload: {
          websites: websites.data,
        },
      });
    },

    *websitesHandleNew({ payload }, { put, select, take }) {
      let { websites = [] } = yield select((state) => state.websiteModel);
      if (!websites.length) {
        yield put({
          type: 'query',
          payload: { global: false },
        });
      }

      yield put({
        type: 'updateState',
        payload: {
          entityForm: [],
          fileList: [],
          previewUrl: null,
          isEdit: payload.isEdit,
        },
      });

      yield put({
        type: 'appModel/activeModel',
        payload: {
          isEdit: payload.isEdit,
          model: 'websiteModel',
          title: i18n.t('model:create', { instance: '$t(instance:website)' }),
        },
      });

      yield take('appModel/activeModel/@@end');
    },

    *prepareToEdit({ payload }, { put, call }) {
      const website = yield call(getWebsite, { key: payload.key });
      if ((website || {}).data) {
        yield put(history.replace(`/pages/websites/${website.data.key}`));
      }
    },

    *websitesHandleEdit({ payload }, { put, call, select, take }) {
      let { websites = [] } = yield select((state) => state.websiteModel);
      if (!websites.length) {
        yield put({
          type: 'query',
          payload: { global: false },
        });
      }

      const website = yield call(getWebsite, { key: payload.key });

      const {
        key,
        name,
        description,
        picture = {},
        tags,
        created_at,
        updated_at,
      } = website.data;

      yield put({
        type: 'updateState',
        payload: {
          fileList: [],
          tags: JSON.parse(tags || '[]'),
          isEdit: payload.isEdit,
          previewUrl: picture.url,
          timestamp: {
            created_at,
            updated_at,
          },
        },
      });

      yield put({
        type: 'toForm',
        payload: {
          model: 'websiteModel',
          entityKey: key,
          name,
          description,
        },
      });

      yield put({
        type: 'appModel/activeModel',
        payload: {
          model: 'websiteModel',
          isEdit: payload.isEdit,
          timestamp: {
            created_at,
            updated_at,
          },
          instance: i18n.t('instance:website'),
          title: i18n.t('model:edit', { instance: '$t(instance:website)' }),
        },
      });

      yield take('appModel/activeModel/@@end');
    },

    *handleAddFile({ payload }, { put, select }) {
      const { fileList } = yield select((state) => state.websiteModel);

      const previewUrl = URL.createObjectURL(payload.file);

      yield put({
        type: 'updateState',
        payload: {
          previewUrl,
          fileList: [...fileList, payload.file],
        },
      });
    },

    *handleRemoveFile({ payload }, { put, select }) {
      const { fileList } = yield select((state) => state.websiteModel);

      const index = fileList.indexOf(payload.file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);

      yield put({
        type: 'updateState',
        payload: {
          previewUrl: null,
          fileList: newFileList,
        },
      });
    },

    *prepareToSave({ payload }, { put, select, call }) {
      const { isEdit } = yield select((state) => state.websiteModel);

      const _payload = {
        ...payload,
        model: 'websiteModel',
      };

      if (!isEdit) {
        _payload.entityKey = yield call(generateKey);
      }

      yield put({
        type: 'save',
        payload: _payload,
      });
    },

    *save({ payload }, { put, call, select }) {
      const { fileList, isEdit, tags } = yield select(
        (state) => state.websiteModel,
      );

      const save = yield call(isEdit ? updateWebsite : saveWebsite, {
        entityForm: payload,
        fileList,
        tags,
      });

      if (request.isSuccess((save || {}).status)) {
        successSaveMsg(isEdit, i18n.t('instance:website'));

        yield put({
          type: 'prepareToEdit',
          payload: {
            key: save.data.key,
          },
        });
      }
    },

    *handleDelete({ payload }, { put, call, select }) {
      const { entityForm, isEdit } = yield select(
        (state) => state.websiteModel,
      );
      const entityKey = isEdit
        ? fromForm(entityForm).entityKey
        : payload.entityKey;

      const destroy = yield call(destroyWebsite, { entityKey });

      if (request.isSuccess((destroy || {}).status)) {
        successDeleteMsg(i18n.t('instance:website'));
        isEdit && (yield put(history.replace(`/pages/websites`)));
      }
    },

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

    *assignWidget({ payload }, { put, select }) {
      const { assignedWidgets } = yield select((state) => state.websiteModel);
      const { widget } = payload;

      if (assignedWidgets.find((assigned) => assigned.key === widget.key)) {
        return false;
      }

      assignedWidgets.push(widget);

      yield put({
        type: 'updateState',
        payload: {
          assignedWidgets: [...assignedWidgets],
        },
      });
    },

    *unassignWidget({ payload }, { put, select }) {
      const { assignedWidgets } = yield select((state) => state.websiteModel);
      const { widget } = payload;

      const _filtered = assignedWidgets.filter(
        (assigned) => assigned.key !== widget.key,
      );

      yield put({
        type: 'updateState',
        payload: {
          assignedWidgets: [..._filtered],
        },
      });
    },

    *saveAssignedWidgets(_, { put, select, call }) {
      const { assignedWidgets, entityForm } = yield select(
        (state) => state.websiteModel,
      );

      const widget_ids = assignedWidgets.map((widget) => widget.key);
      const save = yield call(saveWebsiteWidgets, {
        entityForm: fromForm(entityForm),
        widget_ids,
      });

      if (request.isSuccess((save || {}).status)) {
        successSaveMsg(false, i18n.t('website:assignWidgets'));

        yield put({
          type: 'updateState',
          payload: {
            assignedWidgets: [...save.data.assigned.widgets],
          },
        });
      }
    },
  },
  reducers: {},
});
