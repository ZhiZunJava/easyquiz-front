import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/student',
    meta: { title: { zh_CN: '用户管理', en_US: 'User Manager' }, icon: 'user-circle', orderNo: 1 },
    children: [
      // {
      //   path: 'index',
      //   name: 'UserIndex',
      //   component: () => import('@/pages/user/index.vue'),
      //   meta: { title: { zh_CN: '个人中心', en_US: 'User Center' } },
      // },
      {
        path: 'student',
        name: 'UserStudent',
        component: () => import('@/pages/user/student.vue'),
        meta: { title: { zh_CN: '学生列表管理', en_US: 'Student List Manager' } },
      },
      {
        path: 'admin',
        name: 'UserAdmin',
        component: () => import('@/pages/user/admin.vue'),
        meta: { title: { zh_CN: '管理员列表管理', en_US: 'Admin List Manager' } },
      },
    ],
  },
];
