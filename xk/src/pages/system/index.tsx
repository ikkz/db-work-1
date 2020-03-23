import React from 'react';
import { CommonLayout, MenuInfo } from '../layout';
import { StudentMgr } from './StudentMgr';
import { CourseMgr } from './CourseMgr';
import { Grade } from './Grade';
import { GradeDis } from './GradeDis';
import { Log } from './Log';

const menus: MenuInfo[] = [
  {
    name: '成绩管理',
    component: Grade
  },
  {
    name: '学生管理',
    component: StudentMgr
  },
  {
    name: '课程管理',
    component: CourseMgr
  },
  {
    name: '成绩分布',
    component: GradeDis
  },
  {
    name: '历史记录',
    component: Log
  }
]

export default function () {
  return <CommonLayout title="管理员端" menus={menus} />;
}