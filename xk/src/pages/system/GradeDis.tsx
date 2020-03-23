import React from 'react';
import { AvgGrade, gradeDis, ResturnCode } from '@/api';
import { message } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
interface State {
  grades: AvgGrade[],
}

export class GradeDis extends React.Component<{}, State> {
  state: State = {
    grades: [],
  }

  componentDidMount = async () => {
    try {
      let result = await gradeDis();
      if (result.code === ResturnCode.Ok) {
        this.setState({
          grades: result.data
        });
      } else {
        message.error(result.msg);
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
      <Chart height={400} width={600}
        data={this.state.grades} scale={
          {
            Name: { alias: '课程名称' },
            Grade: { alias: '平均分' },
          }
        }>
        <Axis name="Name" title />
        <Axis name="Grade" title />
        <Legend position="top" />
        <Geom type="interval" position="Name*Grade" color="Name" />
        <Tooltip />
      </Chart>
    </div>;
  }
}