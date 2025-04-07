// store/enumStore.js
import { defineStore } from 'pinia';

// 定义状态
export const useEnumItem = defineStore('enumItem', {
  state: () => ({
    user: {
      sexEnum: [
        { key: 1, value: '男' },
        { key: 2, value: '女' },
      ],
      statusEnum: [
        { key: 1, value: '启用' },
        { key: 2, value: '禁用' },
      ],
      levelEnum: [
        { key: 1, value: '一年级' },
        { key: 2, value: '二年级' },
        { key: 3, value: '三年级' },
        { key: 4, value: '四年级' },
        { key: 5, value: '五年级' },
        { key: 6, value: '六年级' },
        { key: 7, value: '初一' },
        { key: 8, value: '初二' },
        { key: 9, value: '初三' },
        { key: 10, value: '高一' },
        { key: 11, value: '高二' },
        { key: 12, value: '高三' },
        { key: 13, value: '大一' },
        { key: 14, value: '大二' },
        { key: 15, value: '大三' },
        { key: 16, value: '大四' },
      ],
      roleEnum: [
        { key: 1, value: '学生' },
        { key: 2, value: '教师' },
        { key: 3, value: '管理员' },
      ],
      statusTag: [
        { key: 1, value: 'success' },
        { key: 2, value: 'danger' },
      ],
      statusBtn: [
        { key: 1, value: '禁用' },
        { key: 2, value: '启用' },
      ],
      difficulty: [
        { key: 1, value: '入门' },
        { key: 2, value: '简单' },
        { key: 3, value: '中等' },
        { key: 4, value: '困难' },
        { key: 5, value: '专家' },
      ],
    },
    exam: {
      examPaper: {
        paperTypeEnum: [
          { key: 1, value: '固定试卷' },
          { key: 2, value: '时段试卷' },
          { key: 3, value: '智能组卷试卷' },
        ],
      },
      question: {
        typeEnum: [
          { key: 1, value: '单选题' },
          { key: 2, value: '多选题' },
          { key: 3, value: '判断题' },
          { key: 4, value: '填空题' },
          { key: 5, value: '简答题' },
        ],
        editUrlEnum: [
          { key: 1, value: '/question/edit/singleChoice', name: '单选题' },
          { key: 2, value: '/question/edit/multipleChoice', name: '多选题' },
          { key: 3, value: '/question/edit/trueFalse', name: '判断题' },
          { key: 4, value: '/question/edit/gapFilling', name: '填空题' },
          { key: 5, value: '/question/edit/shortAnswer', name: '简答题' },
        ],
        answer: {
          doRightTag: [
            { key: true, value: 'success' },
            { key: false, value: 'danger' },
            { key: null, value: 'warning' },
          ],
          doRightEnum: [
            { key: true, value: '正确' },
            { key: false, value: '错误' },
            { key: null, value: '待批改' },
          ],
          doCompletedTag: [
            { key: false, value: 'default' },
            { key: true, value: 'success' },
          ],
        },
      },
    },
  }),

  // getters
  getters: {
    // 将 enumFormat 改为 getter，直接返回格式化函数
    enumFormat: () => (array: any, key: any) => {
      for (const item of array) {
        if (item.key === key) {
          return item.value;
        }
      }
      return null;
    },
  },

  // actions
  actions: {
    // 如果需要添加异步操作或复杂逻辑，可以在这里定义
    // 目前你的代码没有 actions，可以留空或根据需求添加
  },
});
