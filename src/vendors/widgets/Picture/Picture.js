import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Image } from 'antd';
import { withTranslation } from 'react-i18next';

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

  const { contentForm = {} } = contentModel.widgetsForm[opts.contentKey];
  const { draft } = pictureModel;

  useEffect(() => {
    onSetProperties(properties, opts.contentKey, { contentForm, draft, imageUrl }, true);
  }, []);

  useEffect(() => {
    const imageUrl = contentForm?.imageUrl;
    imageUrl && onSetProperties(properties, opts.contentKey, { contentForm, draft, imageUrl });
  }, [contentForm?.imageUrl]);

  useEffect(() => {
    const imageUrl = contentForm?.imageUrl;
    imageUrl && onSetProperties(properties, opts.contentKey, { contentForm, draft, imageUrl });
  }, [draft]);

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
