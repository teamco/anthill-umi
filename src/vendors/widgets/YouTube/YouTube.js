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
    contentModel,
    onSetProperties,
    onUpdatePreview
  } = props;

  const { contentForm = {} } = contentModel.widgetsForm[opts.contentKey];

  useEffect(() => {
    const youtubeSrc = contentForm?.youtubePreview;
    onSetProperties(properties(), youtubeSrc, opts.contentKey);
  }, [contentForm?.youtubePreview]);

  const youtubeSrc = contentForm?.youtubePreview;

  /**
   * @constant
   * @return {JSX.Element|null}
   */
  const properties = () => {
    const {
      disabledUrl = true
    } = props;

    return youtubeSrc ? (
        <div>
          <GenericPanel header={t('panel:contentProperties')}
                        name={'widget-content-properties'}
                        defaultActiveKey={['widget-content-properties']}>
            {youtubeProperties(onUpdatePreview, youtubeSrc, disabledUrl).map(
                (prop, idx) => (
                    <div key={idx}>{prop}</div>
                )
            )}
          </GenericPanel>
        </div>
    ) : null;
  };

  return youtubeSrc ? (
      <Iframe label={t('form:preview')}
              height={'100%'}
              key={opts.contentKey}
              src={youtubeSrc} />
  ) : null;
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
            youtubePreview: target.value
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
