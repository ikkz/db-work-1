import React from 'react';
import { CommonLayout, MenuInfo } from '../layout';
import { CourseMgr } from './CourseMgr';
import { Grade } from './Grades';

const menus: MenuInfo[] = [
  {
    name: '课程管理',
    component: CourseMgr
  },
  {
    name: '成绩单',
    component: Grade
  }
]

export default function () {
  return <CommonLayout title="学生端" menus={menus} />;
}