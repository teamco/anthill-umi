import React, { useState } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import Form from '@/components/Form';

import {
  pictureFilterProperties,
  pictureModal
} from '@/vendors/widgets/Picture/config/picture.modal';

import styles from '@/vendors/widgets/Picture/picture.module.less';

const { GenericPanel } = Form;

/**
 * @constant
 * @param props
 * @return {*}
 */
const pictureProperties = props => {
  const {
    t,
    form,
    contentProps,
    onUpdateFilterValues,
    onUpdateTransformValues,
    onUpdateFilterSlider,
    onRemoveFilter,
    onUpdatePreview
  } = props;

  const {
    draft,
    sliderProps,
    selectedFilters
  } = contentProps;

  return (
      <div>
        <GenericPanel header={t('panel:contentProperties')}
                      name={'widget-content-properties'}
                      defaultActiveKey={['widget-content-properties']}>
          {pictureModal(onUpdatePreview).map((prop, idx) => (
              <div key={idx}>{prop}</div>
          ))}
        </GenericPanel>
        <GenericPanel className={styles.pictureProperties}
                      header={t('panel:contentPropertiesFilter')}
                      name={'widget-content-properties-filter'}
                      defaultActiveKey={['widget-content-properties-filter']}>
          {pictureFilterProperties({
            onUpdateFilterValues,
            onUpdateTransformValues,
            onUpdateFilterSlider,
            onRemoveFilter,
            sliderProps,
            selectedFilters,
            form,
            draft
          }).map((prop, idx) => (
              <div key={idx}>{prop}</div>
          ))}
        </GenericPanel>
      </div>
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
      onUpdatePreview(previewUrl) {
        dispatch({ type: 'pictureModel/updatePreview', payload: { previewUrl } });
      },
      onRemoveFilter(form, filter, type) {
        dispatch({ type: 'pictureModel/removeFilter', payload: { form, filter, type } });
      },
      onUpdateFilterSlider(form, props) {
        dispatch({ type: 'pictureModel/updateFilterSlider', payload: { props, form } });
      },
      onUpdateFilterValues(form, filter, value, unit = '') {
        dispatch({
          type: 'pictureModel/updateFilterValues',
          payload: { form, filter, value, unit }
        });
      },
      onUpdateTransformValues(form, transform, value, unit = '') {
        dispatch({
          type: 'pictureModel/updateTransformValues',
          payload: { form, transform, value, unit }
        });
      }
    })
)(withTranslation()(pictureProperties));
