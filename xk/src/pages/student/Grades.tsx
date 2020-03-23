import React from 'react';
import { GradeItem, Student, gradeReport, ResturnCode } from "@/api";
import { message, Table, Button } from 'antd';
import ReactToPrint from 'react-to-print';

interface State {
  grades: GradeItem[],
  avg: number
}

export class Grade extends React.Component<{}, State> {
  user: Student = JSON.parse(localStorage.getItem('user') || '{}') as Student;

  state: State = {
    grades: [],
    avg: 0
  }

  ref = React.createRef<HTMLDivElement>()

  componentDidMount = async () => {
    try {
      let result = await gradeReport();
      if (result.code === ResturnCode.Ok) {
        let sum = 0;
        result.data.forEach((v) => sum += v.Grade);
        this.setState({
          grades: result.data,
          avg: result.data.length ? sum / result.data.length : 0
        });
      } else {
        message.error(result.msg);
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return <div>
      <div ref={this.ref} style={{ paddingBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignContent: 'space-between',
          alignItems: 'flex-end',
          padding: '10px 150px'
        }}>
          <div style={{ flex: 1 }}>{this.user.No + ' - ' + this.user.Name}</div>
          <h1 style={{ flex: 1 }}>学生成绩单</h1>
          <div style={{ flex: 1 }}>{(new Date()).toLocaleDateString()}</div>
          <div >平均成绩: {this.state.avg}</div>
        </div>
        <Table
          rowKey="No"
          columns={[
            {
              title: '课程号',
              dataIndex: 'No',
              key: 'No',
            }, {
              title: '课程名称',
              dataIndex: 'Name',
              key: 'Name'
            }, {
              title: '成绩',
              dataIndex: 'Grade',
              key: 'Grade',
            }, {
              title: '学分',
              dataIndex: 'Credit',
              key: 'Credit',
            }, {
              title: '教师',
              dataIndex: 'Tname',
              key: 'Tname'
            }
          ]}
          dataSource={this.state.grades}
          pagination={false} />
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }} />
        <ReactToPrint
          trigger={() => <Button type="primary">打印</Button>}
          content={() => this.ref.current}
        />
      </div>
    </div>;
  }
}