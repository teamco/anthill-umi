import React, { Component, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Image } from 'antd';
import { withTranslation } from 'react-i18next';

import Form from '@/components/Form';

import {
  pictureFilterProperties,
  pictureProperties
} from '@/vendors/widgets/Picture/config/picture.properties';

import styles from './picture.module.less';

const { GenericPanel } = Form;

const Picture = props => {
  const {
    t,
    opts,
    imageUrl,
    pictureModel,
    onUpdateFilter,
    onRemoveFilter,
    onUpdateContentForm,
    onUpdateTransform,
    onUpdateFilterSlider,
    contentModel,
    onSetProperties
  } = props;

  const { contentForm = {} } = contentModel.widgetsForm[opts.contentKey];

  useEffect(() => {
    onSetProperties(properties, imageUrl, opts.contentKey);
  }, []);

  useEffect(() => {
    const imageUrl = contentForm?.imageUrl;
    imageUrl && onSetProperties(properties, imageUrl, opts.contentKey);
  }, [contentForm?.imageUrl]);

  const properties = props => {
    const { style, selectedFilters, sliderProps } = pictureModel;

    const [previewUrl, setUpdatePreview] = useState(contentForm?.imageUrl);

    return (
        <div>
          <GenericPanel header={t('panel:contentProperties')}
                        name={'widget-content-properties'}
                        defaultActiveKey={['widget-content-properties']}>
            {pictureProperties(setUpdatePreview).map((prop, idx) => (
                <div key={idx}>{prop}</div>
            ))}
          </GenericPanel>
          <GenericPanel className={styles.pictureProperties}
                        header={t('panel:contentPropertiesFilter')}
                        name={'widget-content-properties-filter'}
                        defaultActiveKey={['widget-content-properties-filter']}>
            {pictureFilterProperties({
              onUpdateFilterSlider,
              onUpdateFilter,
              onUpdateTransform,
              onRemoveFilter,
              onUpdateContentForm,
              selectedFilters,
              previewUrl,
              style,
              sliderProps
            }).map((prop, idx) => (
                <div key={idx}>{prop}</div>
            ))}
          </GenericPanel>
        </div>
    );
  };

  return (
      <Image width={'100%'} height={'100%'} src={imageUrl} />
  );
};

export default connect(
    ({ pictureModel, contentModel, loading }) => ({
      pictureModel,
      contentModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onUpdateFilter(filter, value, unit = '') {
        dispatch({
          type: 'pictureModel/updateFilter',
          payload: { filter, value, unit }
        });
      },
      onRemoveFilter(filter) {
        dispatch({
          type: 'pictureModel/removeFilter',
          payload: { filter }
        });
      },
      onUpdateTransform(filter, value, unit = '') {
        dispatch({
          type: 'pictureModel/updateTransform',
          payload: { filter, value, unit }
        });
      },
      onSetProperties(properties, imageUrl, contentKey) {
        dispatch({
          type: 'pictureModel/setProperties',
          payload: { properties, imageUrl, contentKey }
        });
      },
      onUpdateFilterSlider(props) {
        dispatch({
          type: 'pictureModel/updateFilterSlider',
          payload: { props }
        });
      },
      onUpdateContentForm(props) {
        dispatch({
          type: 'contentModel/updateContentForm',
          payload: { props }
        });
      }
    })
)(withTranslation()(Picture));
