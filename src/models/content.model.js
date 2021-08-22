/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

const DEFAULTS = {
  overlapping: true,
  alwaysOnTop: false,
  freeze: false,
  draggable: true,
  resizable: true,
  scrollable: false,
  maximizable: false,
  zoomable: false,
  stretchWidth: false,
  stretchHeight: false,
  unstick: 'unstick',
  stick: false,
  statistics: false,
  hideContentOnInteraction: true,
  pageContainment: false,
  showInMobile: true,
  setLayerUp: 0,
  cellWidth: 0,
  rowHeight: 0,
  cellOffset: 0,
  rowOffset: 0
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
    widgetsForm: {},
    contentKey: null
  },
  effects: {

    * setWidgetProps({ payload }, { put }) {
      const { visible = false, widgetProps, updateForm = false } = payload;

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

    * propertiesModalVisibility({ payload }, { put }) {
      const { visible, contentKey } = payload;

      const model = {
        entityKey: contentKey,
        entityType: 'widget'
      };

      yield put({
        type: 'toForm',
        payload: {
          model: 'contentModel',
          form: { ...model }
        }
      });

      yield put({
        type: 'updateState',
        payload: {
          contentKey: visible ? contentKey : null,
          propertiesModalVisible: visible
        }
      });
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
        source,
        contentKey,
        contentForm,
        propsModal,
        model
      } = payload;

      const _widgetsForm = { ...widgetsForm };
      const widgetForm = _widgetsForm[contentKey];

      yield put({
        type: 'updateState',
        payload: {
          widgetsForm: {
            ..._widgetsForm,
            [contentKey]: {
              ...widgetForm,
              targetModel: model,
              contentForm,
              source,
              ContentPropsModal: propsModal
            }
          }
        }
      });
    },

    * updateProps({ payload }, { put, select }) {
      const { widgetsForm, contentKey } = yield select((state) => state.contentModel);
      const { values } = payload;

      const _widgetsForm = { ...widgetsForm };
      const widgetForm = _widgetsForm[contentKey];

      const widgetFormMain = { ...widgetForm.main, ...values?.widget };
      const widgetFormProps = { ...widgetForm.properties, ...values?.behavior };
      const widgetFormContent = { ...widgetForm.contentForm, ...values[widgetForm.source] };

      const model = {
        ..._widgetsForm,
        [contentKey]: {
          ...widgetForm,
          main: { ...widgetFormMain },
          properties: { ...widgetFormProps },
          contentForm: { ...widgetFormContent }
        }
      };

      yield put({
        type: 'updateState',
        payload: { widgetsForm: { ...model } }
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
          hideContent: payload.hide ?
              widgetProps.entityForm.widgetHideContentOnInteraction :
              false
        }
      });
    },

    * widgetStick({ payload }, { put, select }) {
      const { widgetsForm, contentKey } = yield select((state) => state.contentModel);

      const _widgetsForm = { ...widgetsForm };
      const widgetForm = _widgetsForm[contentKey];
      const widgetFormProps = { ...widgetForm.properties };

      widgetFormProps.draggable = false;
      widgetFormProps.stick = payload?.stickTo;

      const model = {
        ..._widgetsForm,
        [contentKey]: {
          ...widgetForm,
          properties: { ...widgetFormProps }
        }
      };

      yield put({
        type: 'updateState',
        payload: { widgetsForm: { ...model } }
      });
    },

    * widgetUnstick({ payload }, { put, select }) {
      const { widgetsForm, contentKey } = yield select((state) => state.contentModel);

      const _widgetsForm = { ...widgetsForm };
      const widgetForm = _widgetsForm[contentKey];
      const widgetFormProps = { ...widgetForm.properties };

      if (payload.unstick) {
        widgetFormProps.unstick = DEFAULTS.unstick;
        widgetFormProps.draggable = DEFAULTS.draggable;
        widgetFormProps.resizable = DEFAULTS.resizable;
        widgetFormProps.stick = false;
      } else {
        widgetFormProps.unstick = false;
      }

      const model = {
        ..._widgetsForm,
        [contentKey]: {
          ...widgetForm,
          properties: { ...widgetFormProps }
        }
      };

      yield put({
        type: 'updateState',
        payload: { widgetsForm: { ...model } }
      });
    }
  },
  reducers: {}
});
