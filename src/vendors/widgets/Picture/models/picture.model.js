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
  'blur': 0,
  'brightness': 1,
  'contrast': 1.1,
  'grayscale': 0.1,
  'opacity': 100,
  'hue-rotate': 0,
  'saturate': 1,
  'scale': 1,
  'scaleX': 1,
  'scaleY': 1,
  'invert': 0.1
};

const DRAFT = {
  style: {},
  defaults: {},
  sliderProps: {
    visible: false,
    filter: {},
    transform: {}
  },
  selectedFilters: []
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'pictureModel',
  state: {
    draft: { ...DRAFT }
  },
  effects: {

    * setProperties({ payload }, { put }) {
      const {
        ContentPropsModal,
        contentKey,
        contentProps,
        reset = false
      } = payload;

      const { imageUrl = DEFAULTS['imageUrl'] } = contentProps;

      if (reset) {
        yield put({
          type: 'contentModel/resetDraft',
          payload: { DRAFT, model: 'pictureModel' }
        });
      }

      yield put({
        type: 'contentModel/setContentProperties',
        payload: {
          model: 'pictureModel',
          contentKey,
          ContentPropsModal,
          source: 'picture',
          contentForm: {
            ...DEFAULTS,
            imageUrl
          },
          contentProps
        }
      });
    },

    * updateSelectedFilters({ payload }, { put, select }) {
      // const { selectedFilters } = yield select((state) => state.pictureModel);
      // const filter = payload.filter;
      //
      // if (!selectedFilters.find((selected) => selected.filter === filter)) {
      //   selectedFilters.push(payload);
      // }
      //
      // yield put({ type: 'updateState', payload: { selectedFilters } });
    },

    * selectFilter({ payload }, { put, select }) {
      // const { selectedFilters } = yield select((state) => state.pictureModel);
      // const filter = payload.filter;
      //
      // if (selectedFilters.find((selected) => selected.filter === filter)) {
      //   yield put({ type: 'updateState', payload: {} });
      // }
    },

    * removeFilter({ payload }, { put, select }) {
      let { draft } = yield select((state) => state.pictureModel);
      const { selectedFilters, sliderProps } = draft;
      const { filter } = payload;
      let _sliderProps = { ...sliderProps };

      if (sliderProps.filter?.key === filter) {
        _sliderProps = { ...DRAFT.sliderProps };
      }

      yield put({
        type: 'updateState',
        payload: {
          draft: {
            selectedFilters: selectedFilters.filter(selected => selected.key !== filter),
            sliderProps: { ..._sliderProps }
          }
        }
      });

      // let _filter = style.filter.split(' ');
      // const idx = findFilterIdx(style, payload);

      // if (idx > -1) {
      //   _filter.splice(idx, 1);
      //   style.filter = _filter.join(' ');
      //   selectedFilters = selectedFilters.filter(
      //       (selected) => selected.filter !== payload.filter
      //   );
      //
      //   yield put({
      //     type: 'cleanEntityForm',
      //     payload: {
      //       key: payload.filter,
      //       model: 'contentModel',
      //       namespace: 'picture'
      //     }
      //   });
      // }
      //
      // yield put({
      //   type: 'updateState',
      //   payload: {
      //     style,
      //     selectedFilters
      //   }
      // });
    },

    * updateFilterValues({ payload }, { put, select, call }) {
      // const { style } = yield select((state) => state.pictureModel);
      //
      // let _selectedFilters = yield call(handleMultipleFilters, {
      //   filterType: 'cssFilter',
      //   style,
      //   payload
      // });
      //
      // yield put({ type: 'updateSelectedFilters', payload });
      //
      // yield put({
      //   type: 'updateState',
      //   payload: { style: { filter: _selectedFilters } }
      // });
    },

    * updateTransformValues({ payload }, { call, put, select }) {
      // const { style } = yield select((state) => state.pictureModel);
      //
      // let _selectedFilters = yield call(handleMultipleFilters, {
      //   style,
      //   filterType: 'cssTransform',
      //   payload
      // });
      //
      // yield put({ type: 'updateSelectedFilters', payload });
      //
      // yield put({
      //   type: 'updateState',
      //   payload: {
      //     style: { transform: _selectedFilters }
      //   }
      // });
    },

    * updateFilterSlider({ payload }, { put, select }) {
      const { draft } = yield select(state => state.pictureModel);
      const { props } = payload;

      props.key = props.name[1];
      props.marks = {
        [props.min]: {
          label: `${props.min}${props?.unit || ''}`
        },
        [props.max]: {
          label: `${props.max}${props?.unit || ''}`
        }
      };

      yield put({
        type: 'updateState',
        payload: {
          draft: {
            selectedFilters: [...draft.selectedFilters, props],
            sliderProps: {
              defaultValue: DEFAULTS[props.key],
              filter: { ...props },
              visible: true
            }
          }
        }
      });
    }
  },
  reducers: {}
});
