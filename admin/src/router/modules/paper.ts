import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/paper',
    name: 'paper',
    component: Layout,
    redirect: '/paper/index',
    meta: { title: { zh_CN: '试卷管理', en_US: 'Paper Manager' }, icon: 'task', orderNo: 3 },
    children: [
      {
        path: 'index',
        name: 'PaperIndex',
        component: () => import('@/pages/paper/index.vue'),
        meta: { title: { zh_CN: '试卷列表管理', en_US: 'Paper List Manager' } },
      },
      {
        path: 'edit',
        name: 'PaperEdit',
        component: () => import('@/pages/paper/edit.vue'),
        meta: { title: { zh_CN: '试卷管理', en_US: 'Paper Edit' } },
      },
    ],
  },
];
