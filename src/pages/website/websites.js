import React, { useEffect } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import history from 'umi';
import { Button, Card, Dropdown, Menu } from 'antd';
import {
  ApiOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ProfileOutlined,
  SettingOutlined,
  StopOutlined,
} from '@ant-design/icons';

import { showConfirm } from '@/utils/modals';
import i18n from '@/utils/i18n';

import styles from './website.module.less';

const { Meta } = Card;
const { SubMenu } = Menu;

/**
 * @export
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const websites = (props) => {
  const {
    t,
    websiteModel,
    onEdit,
    onAssignWidgets,
    onDelete,
    onButtonsMetadata,
    onNew,
    onMode,
    loading,
  } = props;

  useEffect(() => {
    onButtonsMetadata({
      newBtn: {
        onClick: onNew,
        loading: loading.effects['websiteModel/handleNew'],
      },
    });
  }, [websiteModel]);

  /**
   * @constant
   * @param key
   * @param siteKey
   */
  const onMenuClick = ({ key, siteKey }) => {
    if (key.key === 'delete') {
      showConfirm(() => onDelete(siteKey), i18n.t('actions:delete'));
    } else if (key.key === 'assignWidgets') {
      onAssignWidgets(siteKey);
    } else if (key.key === 'development') {
      onMode(siteKey, key.key);
    }
  };

  /**
   * @constant
   * @param siteKey
   * @return {JSX.Element}
   */
  const menu = (siteKey) => {
    return (
      <Menu
        className={styles.websiteMenu}
        onClick={(key) =>
          onMenuClick({
            key,
            siteKey,
          })
        }
      >
        <SubMenu
          title={
            <Button icon={<ProfileOutlined />} type="link">
              {t('website:mode')}
            </Button>
          }
        >
          <Menu.Item key={'development'}>
            <Button icon={<AppstoreAddOutlined />} type="link">
              {t('mode:development')}
            </Button>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key={'assignWidgets'}>
          <Button icon={<ApiOutlined />} type="link">
            {t('website:assignWidgets')}
          </Button>
        </Menu.Item>
        <Menu.Item key={'delete'}>
          <Button danger icon={<DeleteOutlined />} type="link">
            {t('actions:delete')}
          </Button>
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div>
      {websiteModel.websites.length ? (
        websiteModel.websites.map((site, idx) => (
          <Card
            key={idx}
            hoverable
            className={'site-card'}
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined onClick={() => onEdit(site.key)} key="edit" />,
              <Dropdown
                overlay={menu(site.key)}
                placement={'topLeft'}
                trigger={['click']}
              >
                <EllipsisOutlined key="ellipsis" />
              </Dropdown>,
            ]}
            cover={<img alt={site.name} src={site.picture.url} />}
          >
            <Meta
              className={'site-card-title'}
              title={site.name}
              description={site.description}
            />
          </Card>
        ))
      ) : (
        <Card
          key={0}
          hoverable
          className={'site-card site-card-empty'}
          cover={<StopOutlined />}
        >
          <Meta
            className={'site-card-title'}
            title={t('empty:title')}
            description={t('empty:description', {
              instance: '$t(instance:website)',
            })}
          />
        </Card>
      )}
    </div>
  );
};

export default connect(
  ({ websiteModel, loading }) => {
    return {
      websiteModel,
      loading,
    };
  },
  (dispatch) => ({
    dispatch,
    onButtonsMetadata(payload) {
      dispatch({
        type: 'appModel/activeButtons',
        payload,
      });
    },
    onEdit(key) {
      dispatch({
        type: 'websiteModel/prepareToEdit',
        payload: { key },
      });
    },
    onDelete(entityKey) {
      dispatch({
        type: 'websiteModel/handleDelete',
        payload: { entityKey },
      });
    },
    onNew() {
      dispatch(history.push(`/pages/websites/new`));
    },
    onMode(entityKey, mode) {
      history.push(`/pages/websites/${entityKey}/${mode}`);
    },
    onAssignWidgets(entityKey) {
      history.push(`/pages/websites/${entityKey}/widgets`);
    },
  }),
)(withTranslation()(websites));
