import {history} from 'umi';
import dvaModelExtend from 'dva-model-extend';

import {commonModel} from '@/models/common';

import {getWidgets} from '@/services/widget.service';
import {generateKey} from '@/services/common.service';
import PageLayout from '@/pages/website/mode/page/page.layout';
import Logger from '@/core/modules/Logger';

/**
 * @constant
 * @type {Logger}
 */
const logger = new Logger('workspaceModel');

/**
 * @function
 * @param entity
 * @param {string} type
 * @return {string}
 * @private
 */
function _getEntityName(entity, type) {
  let name = '';
  if (type === 'pages') {
    name = entity.entityForm.name;
  } else if (type === 'widgets') {
    name = entity.name;
  }

  return name;
}

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'workspaceModel',
  state: {
    widgets: [],
    pages: [],
    pagesFiltered: [],
    widgetsFiltered: [],
    currentPageWidgets: [],
    pageWidgetsFiltered: [],
    currentPage: undefined,
    navigateTo: 0,
    pageHash: '',
    showPageModal: false,
    collapsedMenu: false,
    onSavePage() {
    }
  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({type: 'setCurrentPage'});
    }
  },
  effects: {

    * mode({payload}, {put}) {
      yield put({
        type: 'appModel/adminLayout',
        payload: {
          visible: false
        }
      });
    },

    * collapse(_, {put, select}) {
      const {collapsedMenu} = yield select(state => state.workspaceModel);

      yield put({
        type: 'updateState',
        payload: {
          collapsedMenu: !collapsedMenu
        }
      });
    },

    * widgets(_, {put, call}) {
      const widgets = yield call(getWidgets);

      yield put({
        type: 'updateState',
        payload: {
          widgets: widgets.data,
          widgetsFiltered: [...widgets.data]
        }
      });
    },

    * setCurrentPage({payload = {}}, {put, call, select}) {
      const {locationPathname, pages} = yield select(state => state.workspaceModel);
      let pageHash = ``;
      let currentPage = pages[payload.idx] || pages[0];

      if (currentPage) {
        if (!currentPage.entityForm.entityKey) {
          currentPage.entityForm.entityKey = yield call(generateKey);
        }

        pageHash = `#/pages/${currentPage.entityForm.entityKey}`;
        currentPage.layout = new PageLayout({}, currentPage);

        yield put({
          type: 'pageModel/setPage',
          payload: {page: currentPage}
        });

        yield put({
          type: 'updateState',
          payload: {
            pages,
            pagesFiltered: [...pages],
            currentPage,
            pageHash
          }
        });

        yield put(history.push(`${locationPathname}${pageHash}`));
      }
    },

    * navigateToPage({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {
          navigateTo: `-${payload.idx * 100}%`
        }
      });

      yield put({
        type: 'setCurrentPage',
        payload: {...payload}
      });
    },

    * showPageSettingModal({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {
          showPageModal: true,
          ...payload
        }
      });

      if (payload.pageSettingOf) {
        yield put({
          type: 'pageModel/setPage',
          payload: {page: payload.pageSettingOf}
        });
      } else {
        yield put({type: 'pageModel/resetState'});
      }
    },

    * resetPage({page}, {put, select}) {
      const {currentPage} = yield select(state => state.workspaceModel);

      if (currentPage) {
        yield put({
          type: 'pageModel/setPage',
          payload: {page: currentPage}
        });
      }
    },

    * cancelModal({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {[payload.type]: false}
      });
    },

    * search({payload}, {put, select}) {
      const state = yield select(state => state.workspaceModel);
      const entities = state[payload.type];
      let filtered = [...entities];

      if (payload.value) {
        const _regex = new RegExp(payload.value, 'gi');
        filtered = entities.filter(entity => _getEntityName(entity, payload.type).match(_regex));
      }

      yield put({
        type: 'updateState',
        payload: {
          [`${payload.type}Filtered`]: filtered
        }
      });
    },

    * addPage({payload}, {put, select}) {
      const {pages} = yield select(state => state.workspaceModel);

      const page = {
        widgets: [],
        entityForm: {...payload.values}
      };

      pages.push(page);

      yield put({
        type: 'updateState',
        payload: {
          showPageModal: false,
          pages
        }
      });

      yield put({
        type: 'navigateToPage',
        payload: {idx: pages.length - 1}
      });
    },

    * updatePageSetting({payload}, {put, select}) {
      const {pages} = yield select(state => state.workspaceModel);
      const page = pages.find(page => page.entityForm.entityKey === payload.page.entityForm.entityKey);

      if (!page) {
        return logger.warn('Unable to get page', page);
      }

      page.entityForm = payload.values;

      yield put({
        type: 'updateState',
        payload: {
          showPageModal: false,
          pages
        }
      });
    },

    * saveCollection({payload}, {put, call, select}) {
      const {pages} = yield select(state => state.workspaceModel);

      console.log(pages);
      // debugger
    }
  },
  reducers: {}
});
