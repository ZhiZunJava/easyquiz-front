import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/message',
    name: 'message',
    component: Layout,
    redirect: '/message/index',
    meta: { title: { zh_CN: '消息管理', en_US: 'Message Manager' }, icon: 'chat-message', orderNo: 6, single: true },
    children: [
      {
        path: 'index',
        name: 'MessageIndex',
        component: () => import('@/pages/message/index.vue'),
        meta: { title: { zh_CN: '消息列表管理', en_US: 'Message List Manager' } },
      },
    ],
  },
];
