import { defineStore } from 'pinia';

import user from '@/api/user';
import { NotificationItem } from '@/types/interface';

const msgData: NotificationItem[] = [];

interface UserQuery {
  [key: string]: any;
}
const allMsg: UserQuery = {};
const unreadMsg: UserQuery = {};
const readMsg: UserQuery = {};
type MsgDataType = typeof msgData;

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    msgData,
    allMsg,
    unreadMsg,
    readMsg,
  }),
  actions: {
    async init(index: number, size: number) {
      await user.messagePageList({ pageIndex: index, pageSize: size, readed: 0 }).then((res) => {
        this.msgData = res.list;
      });
    },
    async getMessage(type: 'allMsg' | 'unreadMsg' | 'readMsg', query: UserQuery) {
      await user.messagePageList(query).then((res) => {
        this[type] = res;
      });
    },
    setMsgData(data: MsgDataType) {
      this.msgData = data;
    },
  },
  persist: true,
});
