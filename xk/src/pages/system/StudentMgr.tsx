import React from 'react';
import { Table, message, Button, Divider, Modal, Form, Input, InputNumber, Radio } from 'antd';
import { Student, createStudent, updateStudent, getStduents, ResturnCode } from '../../api';
import { FormInstance } from 'antd/lib/form';

interface State {
  students: Student[],
  showModal: boolean,
  confirmLoading: boolean
  isAdd: boolean
}

export class StudentMgr extends React.Component<{}, State> {
  state = {
    students: [],
    showModal: false,
    confirmLoading: false,
    isAdd: true
  }

  formRef = React.createRef<FormInstance>();

  componentDidMount = async () => {
    try {
      let key = 'load-student';
      message.loading({
        content: '加载数据...',
        key
      })
      let result = await getStduents();
      if (result.code === ResturnCode.Ok) {
        this.setState({
          students: result.data
        });
        message.success({
          content: '加载成功',
          key
        });
      } else {
        message.error({
          content: result.msg,
          key
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  onAdd = () => {
    this.formRef.current?.resetFields();
    this.setState({
      showModal: true,
      isAdd: true
    });
  }

  onModify = async (student: Student) => {
    this.setState({
      showModal: true,
      isAdd: false
    });
    while (!this.formRef.current) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    this.formRef.current?.setFieldsValue(student);
  }

  handleOk = async (values: any) => {
    this.setState({
      confirmLoading: true
    });
    try {
      let result = await (this.state.isAdd ? createStudent : updateStudent)(values as Student);
      if (result.code === ResturnCode.Ok) {
        this.setState({
          confirmLoading: false,
          showModal: false
        });
        message.success('操作成功');
        this.componentDidMount();
      } else {
        this.setState({
          confirmLoading: false,
        });
        message.error(result.msg);
      }
    } catch (error) {
      console.error(error);
    }
  }

  handleCancel = async () => {
    this.setState({
      showModal: false,
    });
  }


  render() {
    return <div>
      <Button type="primary" onClick={this.onAdd}>添加学生</Button>
      <Divider />
      <Table
        rowKey="No"
        columns={[
          {
            title: '学号',
            dataIndex: 'No',
            key: 'No',
            sorter: (a: Student, b: Student) => a.No.localeCompare(b.No)
          }, {
            title: '姓名',
            dataIndex: 'Name',
            key: 'Name'
          }, {
            title: '性别',
            dataIndex: 'Sex',
            key: 'Sex',
            filters: [{
              text: '男',
              value: '男'
            }, {
              text: '女',
              value: '女'
            }],
            onFilter: (value, record: Student) => record.Sex.indexOf(value) === 0
          }, {
            title: '年龄',
            dataIndex: 'Age',
            key: 'Age',
            sorter: (a: Student, b: Student) => a.Age - b.Age
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
            onFilter: (value, record: Student) => record.Dept.indexOf(value) === 0
          }, {
            title: '登陆名',
            dataIndex: 'Logn',
            key: 'Logn'
          }, {
            title: '密码',
            dataIndex: 'Pswd',
            key: 'Pswd'
          }, {
            title: '操作',
            render: (record) => <Button type="dashed" onClick={() => this.onModify(record)}>修改</Button>
          }
        ]}
        dataSource={this.state.students} />
      <Modal
        title={this.state.isAdd ? '请填写信息' : '请修改信息'}
        visible={this.state.showModal}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={this.handleOk}
          ref={this.formRef}
        >
          <Form.Item
            label="学号"
            name="No"
            rules={[{ required: true, message: '学号不能为空' }]}>
            <Input disabled={(!this.state.isAdd) || this.state.confirmLoading} />
          </Form.Item>
          <Form.Item
            label="姓名"
            name="Name"
            rules={[{ required: true, message: '姓名不能为空' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="性别"
            name="Sex"
            rules={[{ required: true, message: '性别不能为空' }]}>
            <Radio.Group>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="年龄"
            name="Age"
            rules={[{ required: true, message: '年龄不能为空' }, { type: 'number', min: 1, max: 100, message: '年龄必须在 1 - 100之间' }]}>
            <InputNumber min={1} max={100} precision={0} />
          </Form.Item>
          <Form.Item
            label="所在系"
            name="Dept"
            rules={[{ required: true, message: '所在系不能为空' }]}>
            <Radio.Group>
              <Radio value="计算机应用">计算机应用</Radio>
              <Radio value="计算机软件">计算机软件</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="登陆名"
            name="Logn"
            rules={[{ required: true, message: '登陆名不能为空' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="Pswd"
            rules={[{ required: true, message: '密码不能为空' }]}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 6 }}>
            <Button type="primary" htmlType="submit" loading={this.state.confirmLoading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>;
  }
}