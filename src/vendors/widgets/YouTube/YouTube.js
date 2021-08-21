import React, { Component } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import Form from '@/components/Form';
import Iframe from '@/components/Iframe';

import { youtubeProperties } from './config/youtube.properties';

const { GenericPanel } = Form;

class YouTube extends Component {
  properties() {
    const { t, onUpdatePreview, contentModel, disabledUrl = true } = this.props;

    let { youtubePreview } = contentModel;
    if (!youtubePreview) {
      // youtubePreview = { ...fromForm(youtubeModel.entityForm) }.youtubeSrc;
    }

    return youtubePreview ? (
        <div>
          <GenericPanel header={t('panel:contentProperties')}
                        name={'widget-content-properties'}
                        defaultActiveKey={['widget-content-properties']}>
            {youtubeProperties(onUpdatePreview, youtubePreview, disabledUrl).map(
                (prop, idx) => (
                    <div key={idx}>{prop}</div>
                )
            )}
          </GenericPanel>
        </div>
    ) : null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { youtubeModel, embedUrl, onSetProperties, opts } = this.props;
    const _isChanged = JSON.stringify(prevProps.youtubeModel) !==
        JSON.stringify(youtubeModel);

    if (_isChanged) {
      onSetProperties(this.properties(), embedUrl, opts.contentKey);
    }
  }

  componentDidMount() {
    const { onSetProperties, embedUrl, opts } = this.props;
    onSetProperties(this.properties(), embedUrl, opts.contentKey);
  }

  render() {
    const { contentModel, opts, t } = this.props;
    const { contentForm = {} } = contentModel.widgetsForm[opts.contentKey];

    const youtubeSrc = contentForm['youtube/embedUrl'];

    return youtubeSrc ? (
        <Iframe label={t('form:preview')}
                height={'100%'}
                key={opts.contentKey}
                src={youtubeSrc} />
    ) : null;
  }
}

export default connect(
    ({ contentModel, youtubeModel, loading }) => {
      return {
        contentModel,
        youtubeModel,
        loading
      };
    },
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
