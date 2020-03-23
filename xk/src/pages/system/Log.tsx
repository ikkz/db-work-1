import React from 'react';
import { LogItem, ResturnCode, getLogs } from '@/api';
import { Table } from 'antd';

interface State {
  logs: LogItem[]
}

export class Log extends React.Component<{}, State> {

  state: State = {
    logs: []
  }

  componentDidMount = async () => {
    try {
      let result = await getLogs();
      if (result.code === ResturnCode.Ok) {
        this.setState({
          logs: result.data
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return <Table
      rowKey="ID"
      columns={[
        {
          title: '时间',
          dataIndex: 'CreatedAt',
          key: 'CreatedAt',
          render: (v) => new Date(v).toLocaleString()
        }, {
          title: '用户',
          dataIndex: 'Actor',
          key: 'Actor'
        }, {
          title: '详情',
          dataIndex: 'Action',
          key: 'Action'
        }
      ]}
      dataSource={this.state.logs} />
  }
}