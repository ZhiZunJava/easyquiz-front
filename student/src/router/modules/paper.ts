import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/paper',
    name: 'paper',
    component: Layout,
    redirect: '/paper/index',
    meta: { title: { zh_CN: '试卷中心', en_US: 'Paper Manager' }, icon: 'task', orderNo: 3, single: true },
    children: [
      {
        path: 'index',
        name: 'PaperIndex',
        component: () => import('@/pages/paper/index.vue'),
        meta: { title: { zh_CN: '试卷列表', en_US: 'Paper List Manager' } },
      },
    ],
  },
];
