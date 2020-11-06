import {merge} from 'lodash';
import queryString from 'query-string';

import {getEntityFormIdx} from '@/services/common.service';

/**
 * @constant
 * @type {*}}
 */
const customRoutes = {
  widgets: {
    type: 'websiteWidgetsQuery'
  }
};

const MODES = [
  'development',
  'consumption',
  'test'
];

/**
 * @constant
 * @export
 */
const commonModel = {
  state: {
    resetForm: false,
    entityForm: [
      {
        name: 'entityType',
        value: 'form'
      },
      {
        name: 'entityKey',
        value: ''
      }
    ],
    entityFormDraft: [],
    language: 'en-US',
    isEdit: false
  },
  subscriptions: {
    setupHistory(setup) {
      const {dispatch, history} = setup;

      history.listen(data => {

        // In case of route replace
        const location = data.pathname ? data : data.location;

        const keys = location.pathname.split('/').filter(_key => !!_key);
        const _id = keys[keys.length - 1] || '';
        const _scope = keys[keys.length - 2];

        let mode = false;
        if (MODES.indexOf(_id) > -1) {
          mode = _id;
        }

        dispatch({
          type: 'updateState',
          payload: {
            mode,
            locationHash: location.hash,
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search)
          }
        });

        if (mode) {
          return false;
        }

        // TODO: Find more generic way to detect route.
        if (_id.match(/(?:^|\W)new(?:$|\W)/)) {
          dispatch({
            type: `${_scope}HandleNew`,
            payload: {isEdit: false}
          });

        } else if (keys.filter(key => key).length > 2) {

          const _route = customRoutes[_id];
          if (_route) {
            return dispatch({
              type: _route.type,
              payload: {
                key: _scope
              }
            });
          }

          dispatch({
            type: `${_scope}HandleEdit`,
            payload: {
              key: _id,
              isEdit: true
            }
          });

        } else {

          dispatch({
            type: `${_id}Query`,
            payload: {global: true}
          });
        }
      });
    }
  },
  effects: {

    * initFormDraft({payload}, {put, select}) {
      const {entityForm = []} = yield select(state => state[payload.model]);

      yield put({
        type: `${payload.self ? '' : payload.model}/updateState`,
        payload: {
          resetForm: false,
          entityFormDraft: [...entityForm]
        }
      });
    },

    * revertFormValues({payload}, {put, select}) {
      const {entityFormDraft = []} = yield select(state => state[payload.model]);

      yield put({
        type: `${payload.self ? '' : payload.model}/updateState`,
        payload: {
          resetForm: true,
          entityForm: [...entityFormDraft],
          entityFormDraft: []
        }
      });
    },

    * toForm({payload}, {put, select, call}) {
      let entityForm = [...payload.entityForm || []];
      if (!entityForm.length) {
        const state = yield select(state => state[payload.model]);
        entityForm = state.entityForm;
      }

      const _entityForm = [...entityForm];

      delete payload.model;
      delete payload.entityForm;

      const keys = Object.keys(payload);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        const idx = yield call(getEntityFormIdx, {
          entityForm: _entityForm,
          key
        });

        const formItem = {
          name: key,
          value: payload[key]
        };

        if (idx > -1) {
          _entityForm.splice(idx, 1);
        }

        _entityForm.push(formItem);
      }

      yield put({
        type: 'updateState',
        payload: {
          entityForm: [..._entityForm]
        }
      });
    },

    * updateFields({payload}, {put, select, call}) {
      const {entityForm} = yield select(state => state[payload.model]);
      const _entityForm = [...entityForm];

      for (let i = 0; i < payload.changedFields.length; i++) {
        const field = payload.changedFields[i];

        const idx = yield call(getEntityFormIdx, {
          entityForm,
          key: field.name[0]
        });

        const formItem = {
          name: field.name[0],
          value: field.value
        };

        if (idx > -1) {
          _entityForm.splice(idx, 1);
        }

        _entityForm.push(formItem);
      }

      yield put({
        type: 'updateState',
        payload: {
          entityForm: [..._entityForm]
        }
      });
    },

    * cleanEntityForm({payload}, {select, call, put}) {
      const {entityForm} = yield select(state => state[payload.model]);
      let _entityForm = [...entityForm];

      if (payload.namespace === '*') {
        _entityForm = [];
      } else {
        const idx = yield call(getEntityFormIdx, {
          entityForm,
          key: payload.key,
          namespace: payload.namespace
        });

        idx > -1 && _entityForm.splice(idx, 1);
      }

      yield put({
        type: `${payload.self ? '' : payload.model}/updateState`,
        payload: {
          entityForm: [..._entityForm]
        }
      });
    },

    * updateTags({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {
          tags: payload.tags
        }
      });
    }
  },
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload
      };
    },
    mergeState(state, {payload}) {
      return merge({}, state, payload);
    }
  }
};

export {commonModel};
