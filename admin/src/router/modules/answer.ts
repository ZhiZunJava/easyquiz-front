import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/answer',
    name: 'answer',
    component: Layout,
    redirect: '/answer/index',
    meta: { title: { zh_CN: '答卷管理', en_US: 'Answer Manager' }, icon: 'chat-checked', orderNo: 5 },
    children: [
      {
        path: 'index',
        name: 'AnswerIndex',
        component: () => import('@/pages/answer/index.vue'),
        meta: { title: { zh_CN: '待批改试卷管理', en_US: 'Wait Paper List Manager' } },
      },
      {
        path: 'complete',
        name: 'AnswerComplete',
        component: () => import('@/pages/answer/complete.vue'),
        meta: { title: { zh_CN: '已完成试卷管理', en_US: 'Complete Paper List Manager' } },
      },
      {
        path: 'completeRead',
        name: 'AnswerCompleteRead',
        component: () => import('@/pages/answer/completeRead.vue'),
        meta: { title: { zh_CN: '查看试卷', en_US: 'Answer Complete Read Paper' }, hidden: true },
      },
      {
        path: 'judge',
        name: 'AnswerJudge',
        component: () => import('@/pages/answer/judge.vue'),
        meta: { title: { zh_CN: '批改试卷', en_US: 'Judge Paper Manager' }, hidden: true },
      },
    ],
  },
];
