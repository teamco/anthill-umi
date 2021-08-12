/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import {commonModel} from '@/models/common.model';
import {toEntityForm} from '@/utils/state';

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
    opacity: 1,
    hideContent: false,
    propertiesModalVisible: false,
    properties: [],
    contentForm: {},
    widgetProps: {}
  },
  subscriptions: {
    setup({dispatch}) {
    }
  },
  effects: {
    * propertiesModalVisibility({payload}, {put, call, select}) {
      const {contentForm} = yield select((state) => state.contentModel);
      const {visible = false, widgetProps, updateForm = false} = payload;

      yield put({
        type: 'updateState',
        payload: {
          propertiesModalVisible: visible,
          widgetProps,
          updateForm
        }
      });

      if (widgetProps) {
        const widgetName = widgetProps.name;
        const widgetDescription = widgetProps.description;

        const model = {
          ...DEFAULTS,
          widgetName,
          widgetDescription,
          ...contentForm,
          contentKey: widgetProps.contentKey,
          entityKey: widgetProps.key,
          entityType: 'widget'
        };

        const _toEntityForm = yield call(toEntityForm, {model});

        yield put({
          type: 'updateState',
          payload: {
            entityForm: {
              [widgetProps.key]: {..._toEntityForm}
            }
          }
        });
      }

      yield put({
        type: 'pageModel/setActiveWidget',
        payload: {widget: widgetProps}
      });
    },

    * setContentProperties({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {
          contentForm: payload.contentForm,
          contentProperties: payload.contentProperties,
          targetModel: payload.target
        }
      });
    },

    * transferFormRef({payload}, {put, select}) {
      const {targetModel} = yield select((state) => state.contentModel);
      yield put({
        type: `${targetModel}/updateState`,
        payload: {widgetForm: payload.form}
      });
    },

    * updateContentForm({payload}, {put}) {
      yield put({
        type: 'toForm',
        payload: {
          model: 'contentModel',
          ...payload.props
        }
      });
    },

    * setOpacity({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {opacity: payload.opacity}
      });
    },

    * hideContent({payload}, {put, select}) {
      const {widgetProps} = yield select((state) => state.contentModel);
      yield put({
        type: 'updateState',
        payload: {
          hideContent: payload.hide
              ? widgetProps.entityForm.widgetHideContentOnInteraction
              : false
        }
      });
    },

    * widgetStick({payload}, {put, call, select}) {
      const {widget} = yield select((state) => state.pageModel);

      if (widget) {
        const model = widget.entityForm;
        model.widgetStick = payload.stickTo;
        model.widgetDraggable = false;
        model.widgetResizable = false;

        const _toEntityForm = yield call(toEntityForm, {model});

        yield put({
          type: 'toForm',
          payload: {entityForm: _toEntityForm}
        });
      }
    },

    * widgetUnstick({payload}, {put, call, select}) {
      const {widget} = yield select((state) => state.pageModel);

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

        const _toEntityForm = yield call(toEntityForm, {model});

        yield put({
          type: 'toForm',
          payload: {entityForm: _toEntityForm}
        });
      }
    }
  },
  reducers: {}
});
