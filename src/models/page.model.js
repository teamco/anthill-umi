/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';
import Logger from '@/core/modules/Logger';

import { commonModel } from '@/models/common.model';
import { generateKey } from '@/services/common.service';
import { fromForm, getStoredValue, toEntityForm } from '@/utils/state';
import { scrollToRef } from '@/utils/window';

/**
 * @function
 * @param page
 * @param payload
 * @return {*}
 * @private
 */
function _getWidget(page, payload) {
  return ((page || {}).widgets || []).find(
      (widget) => widget.contentKey === (payload.widget || {}).contentKey
  );
}

/**
 * @constant
 * @type {*}
 */
const DEFAULTS = {
  pageWidth: '1024px',
  pageHeight: 'inherit',
  pageAlignment: 'center',
  gridColumns: 256,
  layoutMode: undefined,
  layoutOrganize: undefined,
  layoutEmptySpaces: undefined
};

/**
 * @constant
 * @type {*}
 */
const DEFAULT_STATE = {
  page: undefined,
  widget: undefined
};

/**
 * @constant
 * @type {Logger}
 */
const logger = new Logger('pageModel');

/**
 * @export
 * @default
 */
export default dvaModelExtend(commonModel, {
  namespace: 'pageModel',
  state: {
    ...DEFAULT_STATE,
    modalWidth: '80%'
  },
  subscriptions: {
    setup({ dispatch }) {
    }
  },
  effects: {
    * setPage({ payload }, { put, call }) {
      const { entityForm, layout } = payload.page;

      const pageAlignment = getStoredValue(entityForm, 'pageAlignment', DEFAULTS);
      const pageWidth = getStoredValue(entityForm, 'pageWidth', DEFAULTS);
      const pageHeight = getStoredValue(entityForm, 'pageHeight', DEFAULTS);
      const gridColumns = getStoredValue(entityForm, 'gridColumns', DEFAULTS);
      const layoutMode = getStoredValue(entityForm, 'layoutMode', DEFAULTS);
      const layoutOrganize = getStoredValue(entityForm, 'layoutOrganize', DEFAULTS);
      const layoutEmptySpaces = getStoredValue(entityForm, 'layoutEmptySpaces', DEFAULTS);

      const cellWidth = layout.cellWidth(pageWidth, gridColumns);

      const model = {
        entityKey: entityForm.entityKey,
        name: entityForm.name,
        description: entityForm.description,
        pageAlignment,
        pageWidth,
        pageHeight,
        gridColumns,
        layoutMode,
        layoutOrganize,
        layoutEmptySpaces,
        cellWidth,
        entityType: 'form'
      };

      yield put({
        type: 'updateState',
        payload: {
          page: payload.page,
          tags: entityForm.tags || []
        }
      });

      yield put({
        type: 'toForm',
        payload: {
          model: 'pageModel',
          form: { ...model }
        }
      });

      payload.store && (yield put({ type: 'workspaceModel/saveCollection' }));
    },

    * updatePageHeight({ payload }, { put, select }) {
      const { entityForm } = yield select((state) => state.pageModel);

      const _formValues = fromForm(entityForm);
      let height = _formValues.pageHeight || DEFAULTS.pageHeight;

      if (payload.height) {
        height = payload.height;
      }

      yield put({
        type: 'toForm',
        payload: {
          model: 'pageModel',
          pageHeight: height
        }
      });
    },

    * updateColumnCellWidth({ payload }, { put, select }) {
      const { page, entityForm } = yield select((state) => state.pageModel);

      const _formValues = fromForm(entityForm);
      const cellWidth = page.layout.cellWidth(
          _formValues.pageWidth,
          payload.columns
      );

      yield put({
        type: 'toForm',
        payload: {
          model: 'pageModel',
          gridColumns: payload.columns,
          cellWidth
        }
      });
    },

    * updatePageWidthCellWidth({ payload }, { put, select }) {
      const { page, entityForm } = yield select((state) => state.pageModel);

      const _formValues = fromForm(entityForm);
      const cellWidth = page.layout.cellWidth(
          payload.width,
          _formValues.gridColumns
      );

      yield put({
        type: 'toForm',
        payload: {
          model: 'pageModel',
          pageWidth: payload.width,
          cellWidth
        }
      });
    },

    * addWidget({ payload }, { put, select }) {
      const { pages } = yield select((state) => state.workspaceModel);
      const { page } = yield select((state) => state.pageModel);
      const idx = pages.findIndex(
          (_page) => _page.entityForm.entityKey === page.entityForm.entityKey
      );
      const _pages = [...pages];
      const _page = { ...page };

      if (!_page) {
        return logger.warn('Unable to get page', page);
      }

      const {
        name,
        description,
        width,
        height,
        key,
        contentKey = generateKey()
      } = payload.widget;

      const widgets = [..._page.widgets];

      const widgetProps = {
        name,
        description,
        offset: {
          x: 0,
          y: 0
        },
        dimensions: {
          width,
          height
        },
        key,
        contentKey
      };

      widgets.push(widgetProps);

      yield put({
        type: 'contentModel/propertiesModalVisibility',
        payload: {
          widgetProps
        }
      });

      _page.widgets = [...widgets];

      yield put({
        type: 'setPage',
        payload: {
          page: { ..._page },
          store: true
        }
      });

      _pages[idx] = _page;

      yield put({
        type: 'workspaceModel/updateState',
        payload: {
          currentPageWidgets: [..._page.widgets],
          pageWidgetsFiltered: [..._page.widgets],
          pages: _pages
        }
      });
    },

    * resizeTo({ payload }, { put, select }) {
      const { page } = yield select((state) => state.pageModel);
      const widget = _getWidget(page, payload);

      widget.dimensions = payload.dimensions;

      yield put({
        type: 'setPage',
        payload: {
          page,
          store: payload.store
        }
      });
    },

    * setWidgetPosition({ payload }, { put, select }) {
      const { page } = yield select((state) => state.pageModel);
      const widget = _getWidget(page, payload);

      const offset = widget.offset || {
        x: 0,
        y: 0
      };

      widget.offset = {
        x: offset.x + payload.offset.x,
        y: offset.y + payload.offset.y
      };

      yield put({
        type: 'setPage',
        payload: {
          page,
          store: true
        }
      });
    },

    * setActiveWidget({ payload }, { put, select }) {
      const { page } = yield select((state) => state.pageModel);
      const widget = _getWidget(page, payload);

      yield put({
        type: 'updateState',
        payload: { widget }
      });
    },

    * scrollToWidget({ payload }, { call, select }) {
      const { page } = yield select((state) => state.pageModel);
      const widget = _getWidget(page, payload);

      yield call(scrollToRef, { id: `widget-${widget.contentKey}` });
    },

    * resetState(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          ...DEFAULT_STATE,
          entityForm: []
        }
      });
    }
  },
  reducers: {}
});
