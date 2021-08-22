import React, { Component, useEffect } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import Form from '@/components/Form';

import { scratchProperties } from '@/vendors/widgets/Scratch/config/scratch.properties';

const { GenericPanel } = Form;

const Scratch = props => {
  const {
    t,
    opts,
    contentModel,
    scratchModel,
    onSetProperties
  } = props;

  const { contentForm = {} } = contentModel.widgetsForm[opts.contentKey];

  useEffect(() => {
    onSetProperties(properties, opts.contentKey);
  }, []);

  /**
   * @constant
   * @param [props]
   * @return {JSX.Element|null}
   */
  const properties = props => {
    const {} = props;

    return (
        <div>
          <GenericPanel header={t('panel:contentProperties')}
                        name={'widget-content-properties'}
                        defaultActiveKey={['widget-content-properties']}>
            {scratchProperties().map((prop, idx) => (
                <div key={idx}>{prop}</div>
            ))}
          </GenericPanel>
        </div>
    );
  };

  return <div style={{ padding: 20 }}>Embedded content</div>;
};

export default connect(
    ({ scratchModel, contentModel, loading }) => ({
      scratchModel,
      contentModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onSetProperties(properties, contentKey) {
        dispatch({
          type: 'scratchModel/setProperties',
          payload: { properties, contentKey }
        });
      }
    })
)(withTranslation()(Scratch));
