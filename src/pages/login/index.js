import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'dva';
import {Button, Row, Form, Input} from 'antd';

const FormItem = Form.Item;

const Login = ({
  loading,
  dispatch
}) => {

  const [form] = Form.useForm();

  const {
    scrollToField
  } = form;

  const onFinish = values => {
    console.log('Received values of form: ', values);
  };

  const onFinishFailed = ({errorFields}) => {
    scrollToField(errorFields[0].name);
  };

  return (
      <div>
        <div>
          <img alt="logo"/>
        </div>
        <Form onFinish={onFinish}
              onFinishFailed={onFinishFailed}>
          <FormItem hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Required field'
                      }
                    ]}
                    name={'username'}>
            <Input placeholder="Username"/>
          </FormItem>
          <FormItem hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Required field'
                      }
                    ]}
                    name={'password'}>
            <Input type="password"
                   placeholder="Password"/>
          </FormItem>
          <Row>
            <Button type="primary"
                    loading={loading.effects.login}>
              Sign in
            </Button>
          </Row>
        </Form>
      </div>
  );
};

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
};

export default connect(({loading}) => ({loading}))(Login);
