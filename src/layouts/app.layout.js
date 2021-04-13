import React, { Component, memo, Suspense } from 'react';
import { connect } from 'dva';
import { history, withRouter } from 'umi';
import { Form, Layout } from 'antd';
import { withTranslation } from 'react-i18next';

import Loader from '@/components/Loader';
import Main from '@/components/Main';
import { spinningGlobal, spinningLocal } from '@/utils/state';

import '@/utils/i18n';

import './app.layout.less';

const { Content } = Layout;

class AppLayout extends Component {
  componentDidMount() {
    const { onActiveTab } = this.props;
    // handleActiveTab(onActiveTab);
  }

  render() {
    const {
      t,
      children,
      appModel,
      loading,
      onToggleMenu,
      onNotification,
      onRoute,
    } = this.props;

    const {
      language,
      menus,
      collapsedMenu,
      activeModel,
      activeButtons,
      activeForm,
      layoutOpts: {
        mainMenu,
        mainHeader,
        mainFooter,
        pageHeader,
        pageBreadcrumbs,
      },
    } = appModel;

    return (
      <div>
        {/*<ReactInterval timeout={20000}*/}
        {/*               enabled={true}*/}
        {/*               callback={onNotification}/>*/}
        <Suspense
          fallback={
            <Loader fullScreen spinning={loading.effects['appModel/query']} />
          }
        >
          {/* Have to refresh for production environment */}
          <Layout
            style={{ minHeight: '100vh' }}
            key={language ? language : 'en-US'}
          >
            {mainMenu && (
              <Main.Menu
                data={menus}
                onRoute={onRoute}
                model={activeModel}
                collapsed={collapsedMenu}
                onCollapse={onToggleMenu}
              />
            )}
            <Layout className={'site-layout'}>
              {mainHeader && <Main.Header />}
              <Content>
                <Loader fullScreen spinning={spinningLocal(loading)} />
                <Form.Provider>
                  {pageHeader && (
                    <Main.PageHeader
                      metadata={{
                        model: activeModel,
                        buttons: activeButtons,
                        form: activeForm.form,
                      }}
                    />
                  )}
                  {pageBreadcrumbs && <Main.Breadcrumbs />}
                  <div className="site-layout-content">{children}</div>
                </Form.Provider>
              </Content>
              {mainFooter && (
                <Main.Footer
                  author={t('author', {
                    name: 'Team©',
                    year: 2020,
                  })}
                />
              )}
            </Layout>
          </Layout>
          <Loader fullScreen spinning={spinningGlobal(loading)} />
        </Suspense>
      </div>
    );
  }
}

export default withRouter(
  connect(
    ({ appModel, loading }) => {
      return {
        appModel,
        loading,
      };
    },
    (dispatch) => ({
      dispatch,
      onRoute(path) {
        dispatch(history.push(path));
      },
      onToggleMenu(collapse) {
        dispatch({
          type: `appModel/toggleMenu`,
          payload: { collapse },
        });
      },
      onActiveTab(payload) {
        dispatch({
          type: 'appModel/checkActiveTab',
          payload,
        });
      },
      onNotification() {
        dispatch({ type: 'appModel/notification' });
      },
    }),
  )(withTranslation()(memo(AppLayout))),
);
