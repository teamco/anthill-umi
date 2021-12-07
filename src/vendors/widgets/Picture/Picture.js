import React, { useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Image } from 'antd';
import { withTranslation } from 'react-i18next';

import properties from '@/vendors/widgets/Picture/config/picture.properties';
import { setComplexValue } from '@/utils/form';

/**
 * @export
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Picture = props => {
  const {
    t,
    opts,
    imageUrl,
    pictureModel,
    onSetProperties
  } = props;

  const { draft, sliderProps, selectedFilters } = pictureModel;

  /**
   * @constant
   * @param {boolean} [reset]
   */
  const updateProps = (reset = false) => {
    onSetProperties(properties, opts.contentKey, {
      draft,
      sliderProps,
      selectedFilters
    }, reset);
  }

  useEffect(() => {
    updateProps(true);
  }, []);

  useEffect(() => {
    const imageUrl = draft?.imageUrl;
    imageUrl && updateProps();
  }, [draft]);

  return (
      <Image width={'100%'}
             height={'100%'}
             src={imageUrl} />
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
      onSetProperties(ContentPropsModal, contentKey, contentProps, reset = false) {
        dispatch({
          type: 'pictureModel/setProperties',
          payload: { ContentPropsModal, contentKey, contentProps, reset }
        });
      }
    })
)(withTranslation()(Picture));
