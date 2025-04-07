import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/smart',
    name: 'smart',
    component: Layout,
    redirect: '/smart/index',
    meta: { title: { zh_CN: '智能训练', en_US: 'Smart Center' }, orderNo: 5, single: true },
    children: [
      {
        path: 'index',
        name: 'SmartIndex',
        component: () => import('@/pages/smart/index.vue'),
        meta: { title: { zh_CN: '训练试卷管理', en_US: 'Smart List Manager' } },
      },
    ],
  },
  {
    path: '/record',
    name: 'record',
    component: Layout,
    redirect: '/record/index',
    meta: { title: { zh_CN: '考试记录', en_US: 'Smart Center' }, orderNo: 6, single: true },
    children: [
      {
        path: 'index',
        name: 'RecordIndex',
        component: () => import('@/pages/record/index.vue'),
        meta: { title: { zh_CN: '考试记录管理', en_US: 'Smart List Manager' } },
      },
    ],
  },
];
