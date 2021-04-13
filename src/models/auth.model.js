/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { defineAbilityFor } from '@/utils/auth/ability';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'authModel',
  state: {
    MIN_PASSWORD_LENGTH: 8,
    user: null,
    isSignedOut: false,
    ability: null,
    token: null,
  },
  effects: {
    *query({ payload }, { put }) {
      yield put({
        type: 'defineAbilities',
        payload: { user: null },
      });
    },

    *defineAbilities({ payload }, { put, call }) {
      const ability = yield call(defineAbilityFor, { user: payload.user });

      yield put({
        type: 'updateState',
        payload: { ability },
      });
    },
  },
  reducers: {},
});
