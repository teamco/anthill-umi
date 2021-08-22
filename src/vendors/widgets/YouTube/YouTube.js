import React, { useEffect } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import Form from '@/components/Form';
import Iframe from '@/components/Iframe';

import { youtubeProperties } from './config/youtube.properties';

const { GenericPanel } = Form;

const YouTube = props => {
  const {
    t,
    opts,
    embedUrl,
    contentModel,
    onSetProperties,
    onUpdatePreview,
    disabledUrl = true
  } = props;

  const { contentForm = {} } = contentModel.widgetsForm[opts.contentKey];

  useEffect(() => {
    onSetProperties(properties, embedUrl, opts.contentKey);
  }, []);

  useEffect(() => {
    const youtubeSrc = contentForm?.previewUrl;
    youtubeSrc && onSetProperties(properties, youtubeSrc, opts.contentKey);
  }, [contentForm?.previewUrl]);

  const youtubeSrc = contentForm?.previewUrl;

  /**
   * @constant
   * @param [props]
   * @return {JSX.Element|null}
   */
  const properties = props => {
    const _properties = youtubeProperties(
        onUpdatePreview,
        youtubeSrc,
        disabledUrl
    );

    return (
        <div>
          <GenericPanel header={t('panel:contentProperties')}
                        name={'widget-content-properties'}
                        defaultActiveKey={['widget-content-properties']}>
            {_properties.map((prop, idx) => (
                <div key={idx}>{prop}</div>
            ))}
          </GenericPanel>
        </div>
    );
  };

  return (
      <Iframe label={t('form:preview')}
              height={'100%'}
              key={opts.contentKey}
              src={youtubeSrc} />
  );
};

export default connect(
    ({ contentModel, youtubeModel, loading }) => ({
      contentModel,
      youtubeModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onUpdatePreview({ target }) {
        dispatch({
          type: 'youtubeModel/updatePreview',
          payload: {
            previewUrl: target.value
          }
        });
      },
      onSetProperties(properties, embedUrl, contentKey) {
        dispatch({
          type: 'youtubeModel/setProperties',
          payload: {
            properties,
            embedUrl,
            contentKey
          }
        });
      }
    })
)(withTranslation()(YouTube));
