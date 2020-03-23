import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../pages/index'
    },
    {
      path: '/system',
      component: '../pages/system/index'
    },
    {
      path: '/student',
      component: '../pages/student/index'
    }
    // {
    //   path: '/',
    //   component: '../layouts/index',
    //   routes: [
    //     { path: '/', component: '../pages/index' }
    //   ]
    // }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dynamicImport: false,
      title: '选课成绩管理系统 Demo',
      dll: false,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
}

export default config;
