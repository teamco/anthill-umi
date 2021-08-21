/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { toEntityForm } from '@/utils/state';

const DEFAULTS = {
  widgetOverlapping: true,
  widgetAlwaysOnTop: false,
  widgetFreeze: false,
  widgetDraggable: true,
  widgetResizable: true,
  widgetScrollable: false,
  widgetMaximizable: false,
  widgetZoomable: false,
  widgetStretchWidth: false,
  widgetStretchHeight: false,
  widgetUnstick: 'widgetUnstick',
  widgetStick: false,
  widgetStatistics: false,
  widgetHideContentOnInteraction: true,
  widgetPageContainment: false,
  widgetShowInMobile: true,
  widgetSetLayerUp: 0,
  widgetCellWidth: 0,
  widgetRowHeight: 0
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'contentModel',
  state: {
    modalWidth: '80%',
    propertiesModalVisible: false,
    properties: [],
    contentForm: {},
    widgetsForm: {}
  },
  effects: {

    * setWidgetProps({ payload }, { put }) {
      const { visible = false, widgetProps, page, updateForm = false } = payload;

      if (widgetProps) {
        const form = {
          opacity: 1,
          hideContent: false,
          properties: DEFAULTS,
          main: widgetProps,
          entityType: 'widget',
          updateForm,
          visible
        };

        yield put({ type: 'toWidgetForm', payload: { form } });

        yield put({
          type: 'pageModel/setActiveWidget',
          payload: { widget: widgetProps }
        });
      }
    },

    * toWidgetForm({ payload }, { put, select }) {
      const { widgetsForm } = yield select((state) => state.contentModel);
      const { form } = payload;
      const _widgetsForm = { ...widgetsForm };

      _widgetsForm[form.main.contentKey] = { ...form };

      yield put({
        type: 'updateState',
        payload: { widgetsForm: _widgetsForm }
      });
    },

    * setContentProperties({ payload }, { put, select }) {
      const { widgetsForm } = yield select((state) => state.contentModel);
      const {
        contentKey,
        propsModal,
        contentForm,
        model
      } = payload;

      const _widgetsForm = { ...widgetsForm };
      const _widgetForm = _widgetsForm[contentKey];

      yield put({
        type: 'updateState',
        payload: {
          widgetsForm: {
            ..._widgetsForm,
            [contentKey]: {
              ..._widgetForm,
              contentModel: model,
              contentForm,
              propsModal
            }
          }
        }
      });
    },

    * transferFormRef({ payload }, { put, select }) {
      const { targetModel } = yield select((state) => state.contentModel);
      yield put({
        type: `${targetModel}/updateState`,
        payload: { widgetForm: payload.form }
      });
    },

    * updateContentForm({ payload }, { put }) {
      yield put({
        type: 'toForm',
        payload: {
          model: 'contentModel',
          ...payload.props
        }
      });
    },

    * setOpacity({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: { opacity: payload.opacity }
      });
    },

    * hideContent({ payload }, { put, select }) {
      const { widgetProps } = yield select((state) => state.contentModel);
      yield put({
        type: 'updateState',
        payload: {
          hideContent: payload.hide
              ? widgetProps.entityForm.widgetHideContentOnInteraction
              : false
        }
      });
    },

    * widgetStick({ payload }, { put, call, select }) {
      const { widget } = yield select((state) => state.pageModel);

      if (widget) {
        const model = widget.entityForm;
        model.widgetStick = payload.stickTo;
        model.widgetDraggable = false;
        model.widgetResizable = false;

        const _toEntityForm = yield call(toEntityForm, { model });

        yield put({
          type: 'toForm',
          payload: { entityForm: _toEntityForm }
        });
      }
    },

    * widgetUnstick({ payload }, { put, call, select }) {
      const { widget } = yield select((state) => state.pageModel);

      if (widget) {
        const model = widget.entityForm;
        if (payload.unstick) {
          model.widgetUnstick = DEFAULTS.widgetUnstick;
          model.widgetDraggable = DEFAULTS.widgetDraggable;
          model.widgetResizable = DEFAULTS.widgetResizable;
          model.widgetStick = false;
        } else {
          model.widgetUnstick = false;
        }

        const _toEntityForm = yield call(toEntityForm, { model });

        yield put({
          type: 'toForm',
          payload: { entityForm: _toEntityForm }
        });
      }
    }
  },
  reducers: {}
});
