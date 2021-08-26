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
    onRemoveFilter
  } = props;

  const { draft, contentForm } = contentProps;

  const [previewUrl, setUpdatePreview] = useState(contentForm?.imageUrl);

  return (
      <div>
        <GenericPanel header={t('panel:contentProperties')}
                      name={'widget-content-properties'}
                      defaultActiveKey={['widget-content-properties']}>
          {pictureModal(setUpdatePreview).map((prop, idx) => (
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
            previewUrl,
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
      onRemoveFilter(filter) {
        dispatch({ type: 'pictureModel/removeFilter', payload: { filter } });
      },
      onUpdateFilterSlider(props) {
        dispatch({ type: 'pictureModel/updateFilterSlider', payload: { props } });
      },
      onUpdateFilterValues(filter, value, unit = '') {
        dispatch({
          type: 'pictureModel/updateFilterValues',
          payload: { filter, value, unit }
        });
      },
      onUpdateTransformValues(filter, value, unit = '') {
        dispatch({
          type: 'pictureModel/updateTransformValues',
          payload: { filter, value, unit }
        });
      }
    })
)(withTranslation()(pictureProperties));
