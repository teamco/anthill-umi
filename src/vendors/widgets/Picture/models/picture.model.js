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
  state: { draft: { ...DRAFT } },
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

    * removeFilter({ payload }, { put, select }) {
      let { draft } = yield select((state) => state.pictureModel);
      const { selectedFilters, sliderProps, style } = draft;
      const { filter } = payload;
      let _sliderProps = { ...sliderProps };

      if (sliderProps.filter?.key === filter) {
        _sliderProps = { ...DRAFT.sliderProps };
      }

      let _filter = style.filter.split(' ');
      const idx = findFilterIdx(style, payload);

      if (idx > -1) {
        _filter.splice(idx, 1);
      }

      yield put({
        type: 'updateState',
        payload: {
          draft: {
            style: { filter: _filter.join(' ') },
            selectedFilters: selectedFilters.filter(selected => selected.key !== filter),
            sliderProps: { ..._sliderProps }
          }
        }
      });
    },

    * updateFilterValues({ payload }, { put, select, call }) {
      const { draft } = yield select((state) => state.pictureModel);

      let _selectedFilters = yield call(handleMultipleFilters, {
        filterType: 'cssFilter',
        style: draft.style,
        payload
      });

      yield put({
        type: 'updateState',
        payload: {
          draft: {
            ...draft,
            style: { filter: _selectedFilters }
          }
        }
      });
    },

    * updateTransformValues({ payload }, { call, put, select }) {
      const { draft } = yield select((state) => state.pictureModel);

      let _selectedFilters = yield call(handleMultipleFilters, {
        style: draft.style,
        filterType: 'cssTransform',
        payload
      });

      yield put({
        type: 'updateState',
        payload: {
          draft: {
            ...draft,
            style: { filter: _selectedFilters }
          }
        }
      });
    },

    * updateFilterSlider({ payload }, { put, select }) {
      const { draft } = yield select(state => state.pictureModel);
      const { props } = payload;

      props.key = props.name[1];
      props.marks = {
        [props.min]: {
          label: `${props.min}${props.unit || ''}`
        },
        [props.max]: {
          label: `${props.max}${props.unit || ''}`
        }
      };

      let selectedFilters = [...draft.selectedFilters];

      if (!draft.selectedFilters.find(selected => selected.key === props.key)) {
        selectedFilters = [...selectedFilters, props];
      }

      yield put({
        type: 'updateState',
        payload: {
          draft: {
            ...draft,
            selectedFilters,
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
