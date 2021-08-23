/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import {
  findFilterIdx,
  handleMultipleFilters
} from '@/vendors/widgets/Picture/services/picture.service';

const DEFAULTS = {
  'imageUrl': 'https://www.publicdomainpictures.net/pictures/320000/nahled/background-image.png',
  'brightness': 1,
  'contrast': 1.1,
  'grayscale': 0.1,
  'opacity': 100,
  'hueRotate': 0,
  'saturate': 1,
  'scale': 1,
  'scaleX': 1,
  'scaleY': 1,
  'invert': 0.1
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'pictureModel',
  state: {
    style: {},
    defaults: {},
    sliderProps: {
      visible: false,
      filter: {},
      transform: {}
    },
    selectedFilters: []
  },
  effects: {

    * setProperties({ payload }, { put }) {
      const {
        imageUrl = DEFAULTS['imageUrl'],
        properties,
        contentKey
      } = payload;

      yield put({
        type: 'contentModel/setContentProperties',
        payload: {
          model: 'pictureModel',
          contentKey,
          propsModal: properties,
          source: 'picture',
          contentForm: {
            ...DEFAULTS,
            imageUrl
          }
        }
      });
    },

    * updateSelectedFilters({ payload }, { put, select }) {
      const { selectedFilters } = yield select((state) => state.pictureModel);
      const filter = payload.filter;

      if (!selectedFilters.find((selected) => selected.filter === filter)) {
        selectedFilters.push(payload);
      }

      yield put({ type: 'updateState', payload: { selectedFilters } });
    },

    * selectFilter({ payload }, { put, select }) {
      const { selectedFilters } = yield select((state) => state.pictureModel);
      const filter = payload.filter;

      if (selectedFilters.find((selected) => selected.filter === filter)) {
        yield put({ type: 'updateState', payload: {} });
      }
    },

    * removeFilter({ payload }, { put, select }) {
      let { selectedFilters, style } = yield select((state) => state.pictureModel);

      let _filter = style.filter.split(' ');
      const idx = findFilterIdx(style, payload);

      if (idx > -1) {
        _filter.splice(idx, 1);
        style.filter = _filter.join(' ');
        selectedFilters = selectedFilters.filter(
            (selected) => selected.filter !== payload.filter
        );

        yield put({
          type: 'cleanEntityForm',
          payload: {
            key: payload.filter,
            model: 'contentModel',
            namespace: 'picture'
          }
        });
      }

      yield put({
        type: 'updateState',
        payload: {
          style,
          selectedFilters
        }
      });
    },

    * updateFilter({ payload }, { put, select, call }) {
      const { style } = yield select((state) => state.pictureModel);

      let _selectedFilters = yield call(handleMultipleFilters, {
        filterType: 'cssFilter',
        style,
        payload
      });

      yield put({ type: 'updateSelectedFilters', payload });

      yield put({
        type: 'updateState',
        payload: { style: { filter: _selectedFilters } }
      });
    },

    * updateTransform({ payload }, { call, put, select }) {
      const { style } = yield select((state) => state.pictureModel);

      let _selectedFilters = yield call(handleMultipleFilters, {
        style,
        filterType: 'cssTransform',
        payload
      });

      yield put({ type: 'updateSelectedFilters', payload });

      yield put({
        type: 'updateState',
        payload: {
          style: { transform: _selectedFilters }
        }
      });
    },

    * updateFilterSlider({ payload }, { put }) {
      const { props } = payload;

      props.key = props.name;
      props.marks = {
        [props.min]: {
          label: `${props.min}${props.unit || ''}`
        },
        [props.max]: {
          label: `${props.max}${props.unit || ''}`
        }
      };

      yield put({
        type: 'toForm',
        payload: {
          model: 'pictureModel',
          selectedFilter: props.name
        }
      });

      yield put({
        type: 'updateState',
        payload: {
          sliderProps: {
            defaultValue: DEFAULTS[props.name],
            visible: true,
            filter: props
          }
        }
      });
    }
  },
  reducers: {}
});
