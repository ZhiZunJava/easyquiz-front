import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/log',
    name: 'log',
    component: Layout,
    redirect: '/log/index',
    meta: { title: { zh_CN: '日志管理', en_US: 'Log Manager' }, icon: 'catalog', orderNo: 7, single: true },
    children: [
      {
        path: 'index',
        name: 'LogIndex',
        component: () => import('@/pages/log/index.vue'),
        meta: { title: { zh_CN: '日志列表管理', en_US: 'Log List Manager' } },
      },
    ],
  },
];
