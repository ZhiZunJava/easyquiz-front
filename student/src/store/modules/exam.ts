// store/enumStore.js
import { defineStore } from 'pinia';

import subject from '@/api/subject';

// 定义状态
export const useExam = defineStore('exam', {
  state: () => ({
    subjects: [],
  }),
  // getters
  getters: {
    subjectEnumFormat: () => (array: any, key: any) => {
      for (const item of array) {
        if (item.id === key) {
          return `${item.name} ( ${item.levelName} )`;
        }
      }
      return null;
    },
  },
  actions: {
    initSubject(action?: () => void) {
      subject.list().then((re) => {
        this.subjects = re;
        if (action !== undefined) {
          action();
        }
      });
    },
  },
});
