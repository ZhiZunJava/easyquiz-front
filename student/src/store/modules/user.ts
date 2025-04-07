import Cookies from 'js-cookie';
import { defineStore } from 'pinia';

import user from '@/api/user';
import router from '@/router';

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: Cookies.get('studentUserName'),
    userInfo: Cookies.get('studentUserInfo'),
    messageCount: 0,
  }),
  getters: {
    getUserName: (state) => state.userName,
  },
  actions: {
    async login(query: any) {
      await user.login(query).then(() => {
        this.userName = query.userName;
        Cookies.set('studentUserName', query.userName, { expires: 60 });
      });
    },
    async register(query: any) {
      await user.register(query).then(() => {
        // this.userName = query.userName;
      });
    },
    async getUserInfo() {
      await user.getCurrentUser().then((res) => {
        this.userInfo = res.response;
        Cookies.set('studentUserInfo', res.response, { expires: 60 });
      });
    },
    async logout() {
      await user.logout().then(() => {
        Cookies.remove('adminUserName');
        Cookies.remove('adminUserInfo');
        router.push('/login');
      });
    },
    async getUserMessageInfo() {
      await user.unreadCount().then((res) => {
        this.messageCount = res;
      });
    },
    async messageCountSub(count: number) {
      this.messageCount -= count;
    },
  },
});
