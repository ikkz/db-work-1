import React from 'react';
import { Table, message, Button, Divider, Modal, Form, Input, InputNumber, Radio } from 'antd';
import { ResturnCode, Course, getCourses, createCourse, updateCourse } from '../../api';
import { FormInstance } from 'antd/lib/form';

interface State {
  courses: Course[],
  showModal: boolean,
  confirmLoading: boolean
  isAdd: boolean
}

export class CourseMgr extends React.Component<{}, State> {
  state = {
    courses: [],
    showModal: false,
    confirmLoading: false,
    isAdd: true
  }

  formRef = React.createRef<FormInstance>();

  componentDidMount = async () => {
    try {
      let key = 'load-course';
      message.loading({
        content: '加载数据...',
        key
      })
      let result = await getCourses();
      if (result.code === ResturnCode.Ok) {
        this.setState({
          courses: result.data
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

  onModify = async (course: Course) => {
    this.setState({
      showModal: true,
      isAdd: false
    });
    while (!this.formRef.current) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    this.formRef.current?.setFieldsValue(course);
  }

  handleOk = async (values: any) => {
    this.setState({
      confirmLoading: true
    });
    try {
      let result = await (this.state.isAdd ? createCourse : updateCourse)(values as Course);
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
      <Button type="primary" onClick={this.onAdd}>添加课程</Button>
      <Divider />
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
            render: (record) => <Button type="dashed" onClick={() => this.onModify(record)}>修改</Button>
          }
        ]}
        dataSource={this.state.courses} />
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
            label="课程号"
            name="No"
            rules={[{ required: true, message: '课程号不能为空' }]}>
            <Input disabled={(!this.state.isAdd) || this.state.confirmLoading} />
          </Form.Item>
          <Form.Item
            label="课程名"
            name="Name"
            rules={[{ required: true, message: '课程名不能为空' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="学分"
            name="Credit"
            rules={[{ required: true, message: '学分不能为空' }, { type: 'number', min: 1, max: 100, message: '学分必须在 1 - 100之间' }]}>
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
            label="教师名"
            name="Tname"
            rules={[{ required: true, message: '教师名不能为空' }]}>
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