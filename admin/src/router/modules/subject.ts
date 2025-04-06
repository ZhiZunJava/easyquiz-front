import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/subject',
    name: 'subject',
    component: Layout,
    redirect: '/subject/index',
    meta: { title: { zh_CN: '学科管理', en_US: 'Subject Manager' }, icon: 'education', orderNo: 2, single: true },
    children: [
      {
        path: 'index',
        name: 'SubjectIndex',
        component: () => import('@/pages/subject/index.vue'),
        meta: { title: { zh_CN: '学科列表管理', en_US: 'Subject List Manager' } },
      },
    ],
  },
];
