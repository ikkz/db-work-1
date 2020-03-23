import React from 'react';
import styles from './index.css';
import { Input, Button, message } from 'antd';
import { Icon } from '@ant-design/compatible';
import * as api from './../api';
import router from 'umi/router';

interface State {
  username: string,
  password: string
  loading: boolean
}

export default class Index extends React.Component<{}, State> {
  state = {
    username: '',
    password: '',
    loading: false
  }

  componentWillMount() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }

  setUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      username: event.target.value
    });
  }

  setPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: event.target.value
    });
  }

  setLoading = (loading: boolean) => {
    this.setState({
      loading
    });
  }

  login = async () => {
    this.setLoading(true);
    try {
      const { username, password } = this.state;
      if (username.length === 0 || password.length === 0) {
        message.warn('请填写完整的用户名与密码');
        return;
      }
      let data = await api.login({
        username,
        password
      });
      if (!data.code) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        await message.success('登陆成功', 1).promise;
        if (username.toLowerCase() === 'system') {
          router.push('/system');
        } else {
          router.push('/student');
        }
      } else {
        await message.error(data.msg, 1).promise;
      }
    } catch (error) {

    } finally {
      this.setLoading(false);
    }
  }

  render() {
    const { username, password, loading } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.login}>
          <div className={styles.logo}>
            <Icon type="solution" />
            <span> 选课系统 </span>
          </div>
          <div className={styles.form}>
            <Input prefix={
              <Icon type="user" />
            }
              value={username}
              onChange={this.setUsername} />
            <Input.Password prefix={
              <Icon type="key" />
            }
              value={password}
              onChange={this.setPassword} />
            <Button style={{
              width: '100%'
            }} type='primary'
              loading={loading}
              onClick={this.login}>登陆</Button>
          </div>
        </div>
      </div>
    );
  }
}
