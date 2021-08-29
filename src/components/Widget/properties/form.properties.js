import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { Form, Modal } from 'antd';
import { fillWidgetFormEffect, getFormValue } from '@/utils/state';
import {
  AuditOutlined,
  ExclamationCircleOutlined,
  InteractionOutlined,
  ProfileOutlined
} from '@ant-design/icons';

import styles from '@/components/Widget/widget.module.less';
import FormComponents from '@/components/Form';

import { mainProperties } from '@/components/Widget/properties/main.properties';
import { interactionProperties } from '@/components/Widget/properties/interaction.properties';

const { GenericTabs, GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const FormProperties = props => {

  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const {
    t,
    contentModel,
    onPropertiesModalVisibility,
    onFinish,
    onResetWidget,
    onWidgetStick,
    onWidgetUnstick
  } = props;

  const {
    entityForm,
    widgetsForm,
    modalWidth,
    propertiesModalVisible
  } = contentModel;

  const contentKey = getFormValue(entityForm, 'entityKey');
  const widgetProps = widgetsForm[contentKey];

  const { targetModel, main, ContentPropsModal, source, contentProps } = widgetProps || {};

  useEffect(() => {
    if (propertiesModalVisible && widgetProps) {
      const { main, properties, contentForm } = widgetProps;
      fillWidgetFormEffect(
          [main, properties, contentForm],
          ['widget', 'behavior', source],
          form
      );
      setSaving(false);
    }
  }, [contentKey, widgetProps]);

  const tabs = [
    (<span><AuditOutlined />{t('instance:widget')}</span>),
    (<span><InteractionOutlined />{t('instance:behavior')}</span>),
    (<span><ProfileOutlined />{main?.name}</span>)
  ];

  const _mainProps = mainProperties({
    onChange(type) {
    }
  });

  /**
   * Handle behavior un/stick.
   * @constant
   * @type {*}
   * @private
   */
  const _behaviorProps = interactionProperties({
    onChange(type) {
      if (type.match(/stickTo/)) {
        onWidgetUnstick(false);
        onWidgetStick(type);
      } else if (type.match(/unstick/)) {
        onWidgetUnstick(true);
      }
    }
  });

  /**
   * Handle <Ok> Button click
   * @constant
   */
  const handleOk = () => {
    setSaving(true);
    form.validateFields().then(values => {
      setSaving(false);
      onFinish(values, contentProps);
      onPropertiesModalVisibility(false);
    }).catch(e => {
      setSaving(false);
    });
  };

  return propertiesModalVisible ? (
      <Modal title={t('panel:properties')}
             icon={<ExclamationCircleOutlined />}
             visible={propertiesModalVisible}
             className={styles.modalProperties}
             width={modalWidth}
             destroyOnClose={true}
             centered={true}
             onOk={handleOk}
             okButtonProps={{ disabled: saving }}
             onCancel={() => {
               onResetWidget(targetModel);
               onPropertiesModalVisibility(false);
             }}>
        <Form layout={'vertical'}
              form={form}>
          <GenericTabs tabs={tabs}
                       defaultActiveKey={'0'}>
            <div style={{ marginTop: 10 }}>
              <GenericPanel header={t('panel:widgetProps')}
                            name={'widgetGeneral'}
                            defaultActiveKey={['widgetGeneral']}>
                {_mainProps.main.map((prop, idx) => (
                    <div key={idx}>{prop}</div>
                ))}
              </GenericPanel>
              <GenericPanel header={t('panel:widgetPropsAdvanced')}
                            name={'widgetAdvanced'}>
                {_mainProps.advanced.map((prop, idx) => (
                    <div key={idx}>{prop}</div>
                ))}
              </GenericPanel>
            </div>
            <div>
              <GenericPanel header={t('panel:interactions')}
                            name={'widgetInteractions'}
                            defaultActiveKey={['widgetInteractions']}>
                {_behaviorProps.interactions.map((prop, idx) => (
                    <div key={idx}>{prop}</div>
                ))}
              </GenericPanel>
              <GenericPanel header={t('panel:dimensions')}
                            name={'widgetDimensions'}>
                {_behaviorProps.dimensions.map((prop, idx) => (
                    <div key={idx}>{prop}</div>
                ))}
              </GenericPanel>
            </div>
            <div>
              <ContentPropsModal contentProps={contentProps}
                                 form={form} />
            </div>
          </GenericTabs>
        </Form>
      </Modal>
  ) : null;
};

export default connect(({ contentModel, loading }) => ({
      contentModel,
      loading
    }),
    dispatch => ({
      dispatch,
      onWidgetUnstick(unstick) {
        dispatch({ type: 'contentModel/widgetUnstick', payload: { unstick } });
      },
      onWidgetStick(stickTo) {
        dispatch({ type: 'contentModel/widgetStick', payload: { stickTo } });
      },
      onResetWidget(model) {
        dispatch({ type: 'contentModel/revertFormValues', payload: { model } });
      },
      onFinish(values, contentProps) {
        dispatch({ type: 'contentModel/updateProps', payload: { values, contentProps } });
      },
      onPropertiesModalVisibility(visible, widgetProps) {
        dispatch({
          type: 'contentModel/propertiesModalVisibility',
          payload: { visible, widgetProps }
        });
      }
    })
)(withTranslation()(FormProperties));
