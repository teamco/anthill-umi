import {history} from 'umi';
import dvaModelExtend from 'dva-model-extend';

import {commonModel} from '@/models/common';

import {generateKey} from '@/services/common.service';
import PageLayout from '@/pages/website/mode/page/page.layout';
import Logger from '@/core/modules/Logger';
import {getAssignedWidgets} from '@/services/website.service';

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

    * widgets(_, {put, call, select}) {
      const {websiteKey} = yield select(state => state.workspaceModel);
      const widgets = yield call(getAssignedWidgets, {key: websiteKey});
      const assigned = widgets.data.assigned.widgets;

      yield put({
        type: 'updateState',
        payload: {
          widgets: assigned,
          widgetsFiltered: [...assigned]
        }
      });
    },

    * setCurrentPage({payload = {}}, {put, call, select}) {
      const {locationPathname, pages} = yield select(state => state.workspaceModel);
      let pageHash = ``;
      let _currentPage = pages[payload.idx] || pages[0];

      if (_currentPage) {
        const currentPage = {..._currentPage};
        const entityForm = Object.create(_currentPage.entityForm);
        if (!entityForm.entityKey) {
          entityForm.entityKey = yield call(generateKey);
          currentPage.entityForm = entityForm;
        }

        pageHash = `#/pages/${currentPage.entityForm.entityKey}`;
        currentPage.layout = new PageLayout({}, currentPage);

        yield put({
          type: 'pageModel/setPage',
          payload: {page: {...currentPage}}
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

        history.push(`${locationPathname}${pageHash}`);
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

      yield put({
        type: 'updateState',
        payload: {
          showPageModal: false,
          pages: [...pages, page]
        }
      });

      // Page collection does not updated yet.
      yield put({
        type: 'navigateToPage',
        payload: {idx: pages.length}
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
