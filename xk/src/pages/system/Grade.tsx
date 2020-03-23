import React from 'react';
import { Course, SC, getCourses, ResturnCode, allocCourse, getScs, updateGrade } from '../../api';
import { message, Select, Descriptions, Divider, Table, Typography, Modal } from 'antd';

interface State {
  course: Course,
  courses: Course[],
  scs: SC[],
  loading: boolean,
  selected: string
}

export class Grade extends React.Component<{}, State> {
  state = {
    course: allocCourse(),
    courses: [] as Course[],
    scs: [] as SC[],
    loading: false,
    selected: ""
  }

  componentDidMount = async () => {
    try {
      let result = await getCourses();
      if (result.code === ResturnCode.Ok) {
        this.setState({
          courses: result.data
        });
      } else {
        message.error({
          content: result.msg,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  handleChange = async (value: string) => {
    let course = this.state.courses.find((v: Course) => v.No === value);
    if (course) {
      this.setState({
        course,
        loading: true,
        selected: value
      });
      try {
        let result = await getScs(course.No);
        if (result.code !== ResturnCode.Ok) {
          result.data = []
        }
        this.setState({
          scs: result.data,
          loading: false
        });
      } catch (error) {
        console.error(error);
      }

    } else {
      message.error('不存在课程');
    }
  }

  editGrade = async (sc: SC) => {
    if (sc.Grade === NaN || sc.Grade < 1 || sc.Grade > 100) {
      message.error('请输入1-100以内的分数值');
    } else {
      let result = await updateGrade(sc);
      if (result.code === ResturnCode.Ok) {
        message.success({
          content: '修改成功',
          duration: 1
        });
      } else {
        message.error(result.msg);
      }
    }
    this.handleChange(this.state.selected);
  }

  render() {
    return <div>
      <div>
        <span>请选择课程名：</span>
        <Select style={{ minWidth: '150px' }} onChange={this.handleChange}>
          {
            this.state.courses.map((course: Course) =>
              <Select.Option value={course.No}>
                {`${course.Name} - ${course.Tname}`}
              </Select.Option>
            )
          }
        </Select>
      </div>
      <Divider />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, paddingRight: '20px' }}>
          {
            this.state.course.No ? <Descriptions title="课程信息" bordered>
              <Descriptions.Item label="课程号" span={2}>
                {this.state.course.No}
              </Descriptions.Item>
              <Descriptions.Item label="课程名" span={2}>
                {this.state.course.Name}
              </Descriptions.Item>
              <Descriptions.Item label="学分" span={2}>
                {this.state.course.Credit}
              </Descriptions.Item>
              <Descriptions.Item label="教师名" span={2}>
                {this.state.course.Tname}
              </Descriptions.Item>
              <Descriptions.Item label="所在系" span={2}>
                {this.state.course.Dept}
              </Descriptions.Item>
            </Descriptions> : <div />
          }
        </div>
        <div style={{ flex: 1 }}>
          <Table
            rowKey={(record: SC) => `${record.CNo}${record.SNo}`}
            columns={[
              {
                title: '学号',
                dataIndex: 'SNo',
                key: 'SNo',
              }, {
                title: '成绩',
                dataIndex: 'Grade',
                key: 'Grade',
                render: (_, record: SC) => <Typography.Paragraph
                  editable={{
                    onChange: (value: string) => this.editGrade({
                      ...record,
                      Grade: parseInt(value)
                    })
                  }}
                  style={{
                    marginBottom: '0',
                    width: '100px'
                  }}
                >{record.Grade || "未登记"}
                </Typography.Paragraph>
              }
            ]}
            dataSource={this.state.scs} />
        </div>
      </div>
    </div>;
  }
}