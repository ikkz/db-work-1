import React from 'react';
import { Course, Student, getUserInfo, ResturnCode, allocStudent, getCoursesDetail, CoursesDetail, allocCoursesDetail, selectCourse, backCourse, getLogs, LogItem } from '../../api';
import { Descriptions, Spin, Divider, Table, Button, Popconfirm, message } from 'antd';
import { Icon } from '@ant-design/compatible';
import style from './CourseMgr.css';

interface State {
  userInfo: Student,
  coursesDetail: CoursesDetail,
  selectedCourse: Course[],
  logs: LogItem[]
}

export class CourseMgr extends React.Component<{}, State> {
  state = {
    userInfo: allocStudent(),
    coursesDetail: allocCoursesDetail(),
    selectedCourse: [],
    logs: []
  }


  componentDidMount = async () => {
    try {
      {
        let result = await getUserInfo();
        if (result.code === ResturnCode.Ok) {
          this.setState({
            userInfo: result.data
          });
          localStorage.setItem('user', JSON.stringify(result.data));
        }
      }
      {
        let result = await getCoursesDetail();
        if (result.code === ResturnCode.Ok) {
          this.setState({
            coursesDetail: result.data,
            selectedCourse: [...result.data.Selected, ...result.data.Unback].sort(
              (a, b) => a.No.localeCompare(b.No))
          });
        }
      }
      {
        let result = await getLogs(this.state.userInfo.No);
        if (result.code === ResturnCode.Ok) {
          this.setState({
            logs: result.data
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  onSelect = async (cno: string) => {
    try {
      let result = await selectCourse(cno);
      if (result.code === ResturnCode.Ok) {
        message.success('选课成功');
      } else {
        message.error(result.msg);
      }
      this.componentDidMount();
    } catch (error) {
      console.error(error);
    }
  }

  onBack = async (cno: string) => {
    try {
      let result = await backCourse(cno);
      if (result.code === ResturnCode.Ok) {
        message.success('退课成功');
      } else {
        message.error(result.msg);
      }
      this.componentDidMount();
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { userInfo } = this.state;
    return <div>
      <div className={style.panels}>
        <div className={style.panel}>
          <h3>我的信息</h3>
          <Descriptions bordered>
            <Descriptions.Item label="学号" span={2}>{userInfo.No}</Descriptions.Item>
            <Descriptions.Item label="姓名" span={2}>{userInfo.Name}</Descriptions.Item>
            <Descriptions.Item label="性别" span={2}>{userInfo.Sex}</Descriptions.Item>
            <Descriptions.Item label="年龄" span={2}>{userInfo.Age}</Descriptions.Item>
            <Descriptions.Item label="所在系" span={4}>{userInfo.Dept}</Descriptions.Item>
          </Descriptions>
        </div>
        <div className={style.panel}>
          <h3>操作记录</h3>
          <Table
            pagination={{
              pageSize: 4
            }}
            rowKey="ID"
            columns={[
              {
                title: '时间',
                dataIndex: 'CreatedAt',
                key: 'CreatedAt',
                render: (v) => new Date(v).toLocaleString()
              }, {
                title: '详情',
                dataIndex: 'Action',
                key: 'Action'
              }
            ]}
            dataSource={this.state.logs} />
        </div>
      </div>
      <Divider />
      <div className={style.panels}>
        <div className={style.panel}>
          <h3>可选课程</h3>
          <Table
            rowKey="No"
            columns={[
              {
                title: '课程号',
                dataIndex: 'No',
                key: 'No',
                sorter: (a: Course, b: Course) => a.No.localeCompare(b.No)
              }, {
                title: '课程名称',
                dataIndex: 'Name',
                key: 'Name'
              }, {
                title: '学分',
                dataIndex: 'Credit',
                key: 'Credit',
                sorter: (a: Course, b: Course) => a.Credit - b.Credit
              }, {
                title: '所在系',
                dataIndex: 'Dept',
                key: 'Dept',
                filters: [{
                  text: '计算机应用',
                  value: '计算机应用'
                }, {
                  text: '计算机软件',
                  value: '计算机软件'
                }],
                onFilter: (value, record: Course) => record.Dept.indexOf(value) === 0
              }, {
                title: '教师',
                dataIndex: 'Tname',
                key: 'Tname'
              }, {
                title: '操作',
                render: (record: Course) => <Popconfirm title={`确定选课 ${record.Name} 吗？`}
                  onConfirm={() => this.onSelect(record.No)}
                  okText="确定"
                  cancelText="取消">
                  <Button type="primary">选课</Button>
                </Popconfirm>
              }
            ]}
            dataSource={this.state.coursesDetail.Selectable} />
        </div>
        <div className={style.panel}>
          <h3>已选课程</h3>
          <Table
            rowKey="No"
            columns={[
              {
                title: '课程号',
                dataIndex: 'No',
                key: 'No',
                sorter: (a: Course, b: Course) => a.No.localeCompare(b.No)
              }, {
                title: '课程名称',
                dataIndex: 'Name',
                key: 'Name'
              }, {
                title: '学分',
                dataIndex: 'Credit',
                key: 'Credit',
                sorter: (a: Course, b: Course) => a.Credit - b.Credit
              }, {
                title: '所在系',
                dataIndex: 'Dept',
                key: 'Dept',
                filters: [{
                  text: '计算机应用',
                  value: '计算机应用'
                }, {
                  text: '计算机软件',
                  value: '计算机软件'
                }],
                onFilter: (value, record: Course) => record.Dept.indexOf(value) === 0
              }, {
                title: '教师',
                dataIndex: 'Tname',
                key: 'Tname'
              }, {
                title: '操作',
                render: (record: Course) => {
                  return this.state.coursesDetail.Unback.findIndex((c) => c.No === record.No) < 0 ?
                    <Popconfirm title={`确定退课 ${record.Name} 吗？`}
                      onConfirm={() => this.onBack(record.No)}
                      okText="确定"
                      cancelText="取消">
                      <Button type="danger">退课</Button>
                    </Popconfirm> :
                    <Button disabled type="danger">已登分</Button>
                }
              }
            ]}
            dataSource={this.state.selectedCourse} />
        </div>
      </div>
    </div>
  }
}