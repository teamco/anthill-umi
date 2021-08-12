import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import {withTranslation} from 'react-i18next';

import ErrorModal from '@/components/Authentication/modals/error.modal';
import SignInModal from '@/components/Authentication/modals/signin.modal';
import Page from '@/components/Page';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const login = (props) => {
  const {t, authModel, signInVisible = true, onQuery, onSignIn, loading} = props;

  const {currentUser, errors} = authModel;

  const [isSignInVisible, setIsSignInVisible] = useState(signInVisible);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  useEffect(() => {
    onQuery(currentUser);
    return () => {
      // TODO: handle unmount
    };
  }, [currentUser]);

  let errorProps = {};

  if (errors) {
    errorProps = {
      title: t('error:errorNum', {number: 400}),
      errors
    };

    if (isErrorVisible) {
      // TODO (teamco): Do something.
    } else {
      // setIsErrorVisible(true);
    }
  }

  /**
   * @constant
   */
  const handleErrorCancel = () => {
    setIsErrorVisible(false);
    // setError(null);
  };

  /**
   * @constant
   * @param signInFn
   */
  const handleCancel = (signInFn) => {
    if (typeof signInFn === 'function') {
      signInFn();
    }
  };

  /**
   * @constant
   * @param values
   */
  const onFinish = (values) => {
    setIsSignInVisible(false);
    onSignIn(values.email, values.password);
  };

  const signInProps = {
    isSignInVisible,
    signInVisible: true,
    handleCancel,
    authModel,
    onFinish,
    loading
  };

  return (
      <Page component={'login'}>
        <ErrorModal errorProps={errorProps}
                    isErrorVisible={isErrorVisible}
                    handleErrorCancel={handleErrorCancel} />
        <SignInModal {...signInProps} />
      </Page>
  );
};

export default connect(
    ({authModel, loading}) => {
      return {authModel, loading};
    },
    (dispatch) => ({
      dispatch,
      onQuery(user) {
        dispatch({type: 'authModel/query', payload: {user}});
      },
      onSignIn(email, password) {
        dispatch({type: 'authModel/signIn', payload: {email, password}});
      }
    })
)(withTranslation()(login));
