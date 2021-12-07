/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import {
  findFilterIdx,
  handleMultipleFilters
} from '@/vendors/widgets/Picture/services/picture.service';
import { setComplexValue } from '@/utils/form';

const FILTER = {
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

/**
 * @constant
 * @param selectedFilters
 * @param payload
 * @param type
 * @return {*}
 */
const updateFilterValue = (selectedFilters, payload, type) => {
  return [...selectedFilters].map(selected => {
    const _selected = { ...selected };
    if (selected.key === payload[type]) {
      _selected.filterValue = payload.value;
    }
    return _selected;
  });
};

const DRAFT = {
  style: {}
};

const DEFAULTS = {
  contentProps: {},
  draft: { ...DRAFT },
  selectedFilters: [],
  sliderProps: {
    visible: false,
    filter: {},
    transform: {}
  }
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'pictureModel',
  state: { ...DEFAULTS },
  effects: {

    * setProperties({ payload }, { put }) {
      const {
        ContentPropsModal,
        contentKey,
        contentProps,
        reset = false
      } = payload;

      const { imageUrl = FILTER['imageUrl'] } = contentProps;

      if (reset) {
        yield put({
          type: 'contentModel/resetDraft',
          payload: { DRAFT, model: 'pictureModel' }
        });

        yield put({
          type: 'updatePreview', payload: {
            previewUrl: imageUrl
          }
        });
      }

      yield put({
        type: 'contentModel/setContentProperties',
        payload: {
          model: 'pictureModel',
          contentKey,
          ContentPropsModal,
          source: 'picture',
          contentForm: { imageUrl },
          contentProps
        }
      });
    },

    * removeFilter({ payload }, { put, select }) {
      let { draft, sliderProps, selectedFilters } = yield select((state) => state.pictureModel);
      const { style } = draft;
      const { filter, form, type } = payload;
      let _sliderProps = { ...sliderProps };

      if (sliderProps[type]?.key === filter) {
        _sliderProps = { ...DEFAULTS.sliderProps };
        setComplexValue(form, 'pictureDraft', { filterValue: null });
      }

      let _filter = style[type]?.split(' ');
      const idx = findFilterIdx(style, payload, type);

      if (_filter && idx > -1) {
        _filter.splice(idx, 1);
      }

      yield put({
        type: 'updateState',
        payload: {
          draft: {
            style: {
              ...draft.style,
              [type]: _filter?.join(' ') || ''
            }
          },
          selectedFilters: selectedFilters.filter(selected => selected.key !== filter),
          sliderProps: { ..._sliderProps }
        }
      });
    },

    * updatePreview({ payload }, { put, select }) {
      const { draft } = yield select((state) => state.pictureModel);
      yield put({
        type: 'updateState',
        payload: {
          draft: {
            ...draft,
            imageUrl: payload.previewUrl
          }
        }
      });
    },

    * updateFilterValues({ payload }, { put, select, call }) {
      const { draft, selectedFilters } = yield select((state) => state.pictureModel);

      let _filterStyle = yield call(handleMultipleFilters, {
        filterType: 'filter',
        style: draft.style,
        payload
      });

      yield put({
        type: 'updateState',
        payload: {
          draft: {
            ...draft,
            style: {
              ...draft.style,
              filter: _filterStyle
            }
          },
          selectedFilters: updateFilterValue(selectedFilters, payload, 'filter')
        }
      });

      setComplexValue(payload.form, 'pictureDraft', { filterValue: payload.value });
    },

    * updateTransformValues({ payload }, { call, put, select }) {
      const { draft, selectedFilters } = yield select((state) => state.pictureModel);

      let _selectedFilters = yield call(handleMultipleFilters, {
        style: draft.style,
        filterType: 'transform',
        payload
      });

      yield put({
        type: 'updateState',
        payload: {
          draft: {
            ...draft,
            style: {
              ...draft.style,
              transform: _selectedFilters
            }
          },
          selectedFilters: updateFilterValue(selectedFilters, payload, 'transform')
        }
      });

      setComplexValue(payload.form, 'pictureDraft', { filterValue: payload.value });
    },

    * updateFilterSlider({ payload }, { put, select }) {
      const { draft, selectedFilters } = yield select(state => state.pictureModel);
      const { props, form } = payload;

      props.filterValue = FILTER[props.key];
      props.key = props.name[1];
      props.marks = {
        [props.min]: {
          label: `${props.min}${props.unit || ''}`
        },
        [props.max]: {
          label: `${props.max}${props.unit || ''}`
        }
      };

      let _selectedFilters = [...selectedFilters];

      if (!_selectedFilters.find(selected => selected.key === props.key)) {
        _selectedFilters = [..._selectedFilters, props];
      }

      yield put({
        type: 'updateState',
        payload: {
          draft: { ...draft },
          selectedFilters: [..._selectedFilters],
          sliderProps: {
            filter: { ...props },
            visible: true
          }
        }
      });

      setComplexValue(form, 'pictureDraft', { filterValue: FILTER[props.key] });
    }
  },
  reducers: {}
});
