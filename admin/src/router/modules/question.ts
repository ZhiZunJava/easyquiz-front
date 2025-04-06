import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/question',
    name: 'question',
    component: Layout,
    redirect: '/question/index',
    meta: { title: { zh_CN: '题库管理', en_US: 'Question Manager' }, icon: 'questionnaire', orderNo: 4 },
    children: [
      {
        path: 'index',
        name: 'QuestionIndex',
        component: () => import('@/pages/question/index.vue'),
        meta: { title: { zh_CN: '题目列表管理', en_US: 'Question List Manager' } },
      },
      {
        path: 'edit/singleChoice',
        name: 'QuestionSingleChoice',
        component: () => import('@/pages/question/edit/single-choice.vue'),
        meta: { title: { zh_CN: '单选题管理', en_US: 'QuestionSingleChoice Add Manager' } },
      },
      {
        path: 'edit/multipleChoice',
        name: 'QuestionMultipleChoice',
        component: () => import('@/pages/question/edit/multiple-choice.vue'),
        meta: { title: { zh_CN: '多选题管理', en_US: 'QuestionMultipleChoice Add Manager' } },
      },
      {
        path: 'edit/trueFalse',
        name: 'QuestionTrueFalse',
        component: () => import('@/pages/question/edit/true-false.vue'),
        meta: { title: { zh_CN: '判断题管理', en_US: 'QuestionTrueFalse Add Manager' } },
      },
      {
        path: 'edit/gapFilling',
        name: 'QuestionGapFilling',
        component: () => import('@/pages/question/edit/gap-filling.vue'),
        meta: { title: { zh_CN: '填空题管理', en_US: 'QuestionGapFilling Add Manager' } },
      },
      {
        path: 'edit/shortAnswer',
        name: 'QuestionShortAnswer',
        component: () => import('@/pages/question/edit/short-answer.vue'),
        meta: { title: { zh_CN: '简答题管理', en_US: 'QuestionShortAnswer Add Manager' } },
      },
    ],
  },
];
