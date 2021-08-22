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
    onFieldsChange,
    onFinish,
    onResetWidget,
    onWidgetStick,
    onWidgetUnstick
  } = props;

  const {
    entityForm,
    widgetsForm,
    updateForm,
    modalWidth,
    propertiesModalVisible
  } = contentModel;

  const contentKey = getFormValue(entityForm, 'entityKey');
  const widgetProps = widgetsForm[contentKey];

  const { targetModel, main, ContentPropsModal, source } = widgetProps || {};

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
  }, [contentKey]);

  const tabs = [
    (
        <span>
          <AuditOutlined />
          {t('instance:widget')}
        </span>
    ), (
        <span>
          <InteractionOutlined />
          {t('instance:behavior')}
        </span>
    ), (
        <span>
          <ProfileOutlined />
          {main?.name}
        </span>
    )
  ];

  const _mainProps = mainProperties({
    onChange(type) {
    }
  });

  const _behaviorProps = interactionProperties({
    onChange(type) {
      if (type.match(/widgetStickTo/)) {
        onWidgetUnstick(false);
        onWidgetStick(type);
      } else if (type.match(/widgetUnstick/)) {
        onWidgetUnstick(true);
      }
    }
  });

  const handleOk = () => {
    setSaving(true);
    form.validateFields().then(values => {
      form.resetFields();
      debugger
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
             okButtonProps={{ disabled: !updateForm || saving }}
             onCancel={() => {
               onResetWidget(targetModel);
               onPropertiesModalVisibility(false);
             }}>
        <Form layout={'vertical'}
              form={form}
              onFieldsChange={onFieldsChange}
              initialValues={[
                {
                  name: [source, 'text'],
                  value: main?.name
                }
              ]}
              onFinish={onFinish}>
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
              <ContentPropsModal />
            </div>
          </GenericTabs>
        </Form>
      </Modal>
  ) : null;
};

export default connect(({
      contentModel,
      loading
    }) => {
      return {
        contentModel,
        loading
      };
    },
    dispatch => ({
      dispatch,
      // onFieldsChange(changedFields, allFields) {
      //   dispatch({
      //     type: 'contentModel/updateFields',
      //     payload: {
      //       changedFields,
      //       allFields,
      //       model: 'contentModel'
      //     }
      //   });
      // },
      onTransferFormRef(form) {
        dispatch({
          type: 'contentModel/transferFormRef',
          payload: { form }
        });
      },
      onWidgetUnstick(unstick) {
        dispatch({
          type: 'contentModel/widgetUnstick',
          payload: { unstick }
        });
      },
      onWidgetStick(stickTo) {
        dispatch({
          type: 'contentModel/widgetStick',
          payload: { stickTo }
        });
      },
      onResetWidget(model) {
        dispatch({
          type: 'contentModel/revertFormValues',
          payload: { model }
        });
      },
      onFinish() {
      },
      onPropertiesModalVisibility(visible, widgetProps) {
        dispatch({
          type: 'contentModel/propertiesModalVisibility',
          payload: {
            visible,
            widgetProps
          }
        });
      }
    })
)(withTranslation()(FormProperties));
