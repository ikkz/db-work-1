import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { SelectParam } from 'antd/lib/menu';
import style from './layout.css';
import router from 'umi/router';

const { Header, Content, Footer } = Layout;

export interface MenuInfo {
  name: string,
  component: any
}

interface Props {
  title: string,
  menus: MenuInfo[]
}

interface State {
  selectedKeys: string[]
}

export class CommonLayout extends React.Component<Props, State> {

  state = {
    selectedKeys: [this.props.menus[0]?.name]
  }

  onSelect = (param: SelectParam) => {
    this.setState({
      selectedKeys: param.selectedKeys
    });
  }

  onLogout = () => {
    router.replace('/');
  }

  render() {
    const { title, menus } = this.props;

    return <Layout>
      <Header className={style.header}>
        <span className={style.title}> {title} </span>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={this.state.selectedKeys}
          onSelect={this.onSelect}
          style={{ lineHeight: '64px' }}
          className={style.menu}
        >
          {menus.map((menu) => {
            return <Menu.Item key={menu.name}> {menu.name} </Menu.Item>;
          })}
        </Menu>
        <div className={style.logout}>
          <Button type="danger" onClick={this.onLogout}>
            注销
          </Button>
        </div>
      </Header>
      <Content style={{ padding: '50px', marginTop: 64 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
          {React.createElement(menus.find((menu) => menu.name === this.state.selectedKeys[0])?.component)}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}> By 17122990 </Footer>
    </Layout>
  }
}