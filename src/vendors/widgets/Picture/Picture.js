import React, { useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Image } from 'antd';
import { withTranslation } from 'react-i18next';

import { asyncFn } from '@/utils/promise';
import properties from '@/vendors/widgets/Picture/config/picture.properties';

const Picture = props => {
  const {
    t,
    opts,
    imageUrl,
    contentModel,
    pictureModel,
    onSetProperties
  } = props;

  const isMounted = useRef(true);

  const { contentForm = {} } = contentModel.widgetsForm[opts.contentKey];
  const { draft, sliderProps, selectedFilters } = pictureModel;

  const deps = [contentForm?.imageUrl, draft];

  /**
   * @constant
   * @param {boolean} [reset]
   */
  const updateProps = (reset = false) => {
    onSetProperties(properties, opts.contentKey, {
      contentForm,
      sliderProps,
      selectedFilters,
      draft,
      imageUrl
    }, reset);
  }

  useEffect(() => {
    updateProps(true);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    asyncFn().then(() => {
      if (isMounted.current) {
        const imageUrl = contentForm?.imageUrl;
        imageUrl && updateProps();
      }
    });
    return () => {
      isMounted.current = false;
    };
  }, deps);

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
      onSetProperties(ContentPropsModal, contentKey, contentProps, reset = false) {
        dispatch({
          type: 'pictureModel/setProperties',
          payload: { ContentPropsModal, contentKey, contentProps, reset }
        });
      }
    })
)(withTranslation()(Picture));
