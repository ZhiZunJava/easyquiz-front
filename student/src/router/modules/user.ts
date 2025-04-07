import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/index',
    meta: { title: { zh_CN: '个人中心', en_US: 'User Center' }, icon: 'user-circle', hidden: true },
    children: [
      {
        path: 'index',
        name: 'UserIndex',
        component: () => import('@/pages/user/index.vue'),
        meta: { title: { zh_CN: '个人中心', en_US: 'User Center' } },
      },
      {
        path: 'message',
        name: 'MessageIndex',
        component: () => import('@/pages/user/message.vue'),
        meta: { title: { zh_CN: '消息中心', en_US: 'Message Center' } },
      },
    ],
  },
  {
    path: '/do',
    name: 'do',
    meta: { title: { zh_CN: '考试中心 - 考试', en_US: 'Do Quiz' }, hidden: true },
    component: () => import('@/pages/exam/paper/do.vue'),
  },
  {
    path: '/read',
    name: 'read',
    meta: { title: { zh_CN: '考试中心 - 查看', en_US: 'Read Quiz' }, hidden: true },
    component: () => import('@/pages/exam/paper/read.vue'),
  },
];
