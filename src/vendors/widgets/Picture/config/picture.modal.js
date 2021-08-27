import React from 'react';
import { Image, Input, Select, Slider, Tag, Tooltip } from 'antd';
import { Html5Outlined } from '@ant-design/icons';

import i18n from '@/utils/i18n';
import { setComplexValue } from '@/utils/form';

import styles from '@/vendors/widgets/Picture/picture.module.less';

const { TextArea } = Input;
const { Option } = Select;

export const pictureModal = (setUpdatePreview) => {
  return [
    [
      <Input type={'text'}
             label={i18n.t('form:name')}
             name={['picture', 'text']}
             key={'pictureText'} />
    ],
    [
      <TextArea label={i18n.t('form:imgUrl')}
                name={['picture', 'imageUrl']}
                key={'pictureImageUrl'}
                onChange={e => {
                  setUpdatePreview(e.target.value)
                }}
                autoSize={{
                  minRows: 4,
                  maxRows: 10
                }}
                type={'textarea'} />
    ]
  ];
};

/**
 * @export
 * @param onUpdateFilterValues
 * @param onUpdateFilterSlider
 * @param onUpdateTransformValues
 * @param onRemoveFilter
 * @param previewUrl
 * @param form
 * @param draft
 * @return {JSX.Element[][]}
 */
export const pictureFilterProperties = ({
  onUpdateFilterSlider,
  onUpdateFilterValues,
  onUpdateTransformValues,
  onRemoveFilter,
  previewUrl,
  form,
  draft
}) => {
  /**
   * @constant
   * @param filter
   */
  const onChangeFilter = (filter) => {
    const props = sliders[filter];
    props.className = styles.filterSlider;

    onUpdateFilterSlider(form, props);
  };

  const sliders = {
    blur: {
      label: i18n.t('filter:blur'),
      name: ['picture', 'blur'],
      type: 'filter',
      tipFormatter: (value) => `${i18n.t('filter:blurRadius')}: ${value}px`,
      onAfterChange: (value) => onUpdateFilterValues(form, 'blur', value, 'px'),
      unit: 'px',
      min: 0,
      max: 100,
      step: 1
    },
    scaleX: {
      label: i18n.t('filter:scaleHorizontal'),
      name: ['picture', 'scaleX'],
      type: 'transform',
      onAfterChange: (value) => onUpdateTransformValues(form, 'scaleX', value),
      min: -10,
      max: 10,
      step: 0.1
    },
    scaleY: {
      label: i18n.t('filter:scaleVertical'),
      name: ['picture', 'scaleY'],
      type: 'transform',
      onAfterChange: (value) => onUpdateTransformValues(form, 'scaleY', value),
      min: -10,
      max: 10,
      step: 0.1
    },
    brightness: {
      label: i18n.t('filter:brightness'),
      name: ['picture', 'brightness'],
      type: 'filter',
      onAfterChange: (value) => onUpdateFilterValues(form, 'brightness', value),
      min: 0.1,
      max: 10,
      step: 0.1
    },
    contrast: {
      label: i18n.t('filter:contrast'),
      name: ['picture', 'contrast'],
      type: 'filter',
      onAfterChange: (value) => onUpdateFilterValues(form, 'contrast', value),
      min: 0.1,
      max: 10,
      step: 0.1
    },
    grayscale: {
      label: i18n.t('filter:grayscale'),
      name: ['picture', 'grayscale'],
      type: 'filter',
      onAfterChange: (value) => onUpdateFilterValues(form, 'grayscale', value),
      min: 0.1,
      max: 1,
      step: 0.01
    },
    'hue-rotate': {
      label: i18n.t('filter:hueRotate'),
      name: ['picture', 'hue-rotate'],
      type: 'filter',
      tipFormatter: (value) => `${i18n.t('filter:angle')}: ${value}deg`,
      onAfterChange: (value) => onUpdateFilterValues(form, 'hue-rotate', value, 'deg'),
      unit: 'deg',
      min: 0,
      max: 360,
      step: 1
    },
    scale: {
      label: i18n.t('filter:scale'),
      name: ['picture', 'zoom'],
      type: 'transform',
      onAfterChange: (value) => onUpdateTransformValues(form, 'scale', value, 'deg'),
      unit: 'deg',
      min: -10,
      max: 10,
      step: 0.1
    },
    invert: {
      label: i18n.t('filter:invert'),
      name: ['picture', 'invert'],
      type: 'filter',
      onAfterChange: (value) => onUpdateFilterValues(form, 'invert', value),
      min: 0.1,
      max: 1,
      step: 0.01
    },
    saturate: {
      label: i18n.t('filter:saturate'),
      name: ['picture', 'saturate'],
      type: 'filter',
      onAfterChange: (value) => onUpdateFilterValues(form, 'saturate', value),
      min: 0.1,
      max: 10,
      step: 0.1
    },
    sepia: {
      label: i18n.t('filter:sepia'),
      name: ['picture', 'sepia'],
      type: 'filter',
      onAfterChange: (value) => onUpdateFilterValues(form, 'sepia', value),
      min: 0.1,
      max: 1,
      step: 0.01
    },
    opacity: {
      label: i18n.t('filter:opacity'),
      name: ['picture', 'opacity'],
      type: 'filter',
      tipFormatter: (value) => `${value}%`,
      onAfterChange: (value) => onUpdateFilterValues(form, 'opacity', value, '%'),
      unit: '%',
      min: 0,
      max: 100,
      step: 1
    }
  };

  const filterValueProps = {
    ...draft?.sliderProps.filter,
    name: ['picture', 'filterValue']
  };

  /**
   * @constant
   * @param filter
   * @return {string}
   */
  const filterValueTitle = filter => {
    const value = form.getFieldValue('picture').filterValue || filter.min;
    return `${value}${filter.unit || ''}`;
  };

  return [
    [
      <Select label={i18n.t('filter:filter')}
              key={'selectedFilter'}
              name={['picture', 'selectedFilter']}
              placeholder={i18n.t('form:placeholder', { field: '$t(filter:filter)' })}
              onChange={onChangeFilter}
              style={{ width: '100%' }}>
        {Object.keys(sliders).sort().map((slider) => {
          const _filter = sliders[slider];
          const disabled = draft?.selectedFilters?.find(selected => selected.key === _filter.name[1]);
          return (
              <Option disabled={disabled}
                      key={_filter.name[1]}
                      value={_filter.name[1]}>
                {_filter.label}
              </Option>
          );
        })}
      </Select>,
      <Image label={i18n.t('form:preview')}
             key={'imageUrl'}
             width={'100%'}
             height={'100%'}
             style={draft?.style}
             src={previewUrl} />
    ],
    [
      <Slider disabled={!draft?.sliderProps.visible}
              key={'active-filter'}
              {...filterValueProps} />,
      <div label={i18n.t('filter:selectedFilters')}
           key={'selected-filters'}>
        {draft?.selectedFilters?.map((selected) => {
          return (
              <Tag onClose={() => {
                onRemoveFilter(form, selected.key);
                if (selected.key === form.getFieldValue('picture').selectedFilter) {
                  setComplexValue(form, 'picture', { selectedFilter: null });
                }
              }}
                   className={styles.filterTag}
                   icon={<Html5Outlined />}
                   color={'success'}
                   closable
                   key={selected.key}>
                <Tooltip title={filterValueTitle(selected)}>
                  <span style={{ cursor: 'pointer' }}
                        onClick={() => {
                          onChangeFilter(selected.key);
                          setComplexValue(form, 'picture', { selectedFilter: selected.key });
                        }}>
                    {selected.label}
                  </span>
                </Tooltip>
              </Tag>
          );
        })}
      </div>
    ]
  ];
};

// imageRepeatX
// imageRepeatY
// imageStretch
// imageSplitContent
// imageScaleHorizontal
// imageScaleVertical
// imageSaturate
// imageSepia
// imageDropShadow
// imageZoom
// imageRotate
// imageSkewY
// imageSkewX

//
//
// , imageSaturate: { type: 'range', disabled:
// true, visible: true, value: 1, min: 0.1, max: 10, step: 0.1, unit: '', monitor: {
// events: ['update.preview'], callback: 'updatePreview' } }, imageSepia: { type:
// 'range', disabled: true, visible: true, value: 0.1, min: 0.1, max: 1, step: 0.01,
// unit: '', monitor: { events: ['update.preview'], callback: 'updatePreview' } },
// imageDropShadow: { type: 'range', disabled: true, visible: true, value: 0, min: 0,
// max: 50, step: 1, unit: 'px', monitor: { events: ['update.preview'], callback:
// 'updatePreview' } }, imageBorder: { type: 'range', disabled: true, visible: true,
// value: 0, min: 0, max: 20, step: 0.01, unit: 'rem', monitor: { events:
// ['update.preview'], callback: 'updatePreview' } }, imageRadius: { type: 'range',
// disabled: true, visible: true, value: 0, min: 0, max: 50, step: 0.05, unit: '%',
// monitor: { events: ['update.preview'], callback: 'updatePreview' } }, imageZoom: { type: 'range', disabled: true,
// visible: true, value: 100, min: 1, max: 200, step: 0.1, unit: '%', monitor: { events: ['update.preview'], callback:
// 'updatePreview' } }, imageRotate: { type: 'range', disabled: true, visible: true, value: 0, min: -360, max: 360,
// step: 1, unit: 'deg', monitor: { events: ['update.preview'], callback: 'updatePreview' } }, imageSkewY: { type:
// 'range', disabled: true, visible: true, value: 0, min: -100, max: 100, step: 1, unit: 'deg', monitor: { events:
// ['update.preview'], callback: 'updatePreview' } }, imageSkewX: { type: 'range', disabled: true, visible: true,
// value: 0, min: -100, max: 100, step: 1, unit: 'deg', monitor: { events: ['update.preview'], callback:
// 'updatePreview' } } };
