import React, { useEffect } from 'react';
import { connect } from 'dva';
import { useParams } from 'umi';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import { Layout } from 'antd';

import styles from '@/pages/website/mode/mode.module.less';
import appStyles from '@/layouts/app.layout.less';

import Workspace from '@/pages/website/mode/Workspace';
import MenuDevelopment from '@/pages/website/mode/development/menu.development';

import FormProperties from '@/components/Widget/properties/form.properties';

const { Content } = Layout;

const websiteDevelopment = props => {

  const {
    onMode,
    onWidgets,
    workspaceModel
  } = props;

  const { websiteKey } = useParams();

  useEffect(() => {
    onMode();
    onWidgets(websiteKey);
  }, []);

  const {
    mode,
    navigateTo,
    pages,
    timestamp = {}
  } = workspaceModel;

  const widgetFormProps = {};

  return (
      <Layout className={classnames(styles.layout, mode)}>
        <MenuDevelopment {...props} />
        <Layout className={appStyles.siteLayout}>
          <Content style={{ margin: 0 }}>
            <div className={styles.workspace}>
              <Workspace pages={pages}
                         navigateTo={navigateTo} />
              <FormProperties />
            </div>
          </Content>
        </Layout>
      </Layout>
  );
};

export default connect(({
      workspaceModel,
      loading
    }) => ({
      workspaceModel,
      loading
    }),
    dispatch => ({
      dispatch,
      onMode() {
        dispatch({ type: 'workspaceModel/mode' });
      },
      onCollapse() {
        dispatch({ type: 'workspaceModel/collapse' });
      },
      onWidgets(websiteKey) {
        dispatch({ type: 'workspaceModel/widgets', payload: { websiteKey } });
      },
      onNavigateToPage(idx) {
        dispatch({ type: 'workspaceModel/navigateToPage', payload: { idx } });
      },
      onPageSettingModal(onSavePage, page) {
        dispatch({
          type: 'workspaceModel/showPageSettingModal',
          payload: {
            onSavePage,
            pageSettingOf: page
          }
        });
      },
      onAddPage(values) {
        dispatch({ type: 'workspaceModel/addPage', payload: { values } });
      },
      onScrollToWidget(widget) {
        dispatch({ type: 'pageModel/scrollToWidget', payload: { widget } });
      },
      onAddWidget(widget) {
        dispatch({ type: 'pageModel/addWidget', payload: { widget } });
      },
      onSearch(entities, value, type) {
        dispatch({
          type: 'workspaceModel/search',
          payload: {
            entities,
            value,
            type
          }
        });
      },
      onCancelModal(type) {
        dispatch({ type: 'workspaceModel/cancelModal', payload: { type } });
      },
      onUpdatePageSetting(values, page) {
        dispatch({
          type: 'workspaceModel/updatePageSetting',
          payload: {
            values,
            page
          }
        });
      }
    })
)(withTranslation()(websiteDevelopment));
