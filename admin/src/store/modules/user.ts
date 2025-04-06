import Cookies from 'js-cookie';
import { defineStore } from 'pinia';

import user from '@/api/user';
import router from '@/router';

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: Cookies.get('adminUserName'),
    userInfo: Cookies.get('adminUserInfo'),
  }),
  getters: {
    getUserName: (state) => state.userName,
  },
  actions: {
    async login(query: any) {
      await user.login(query).then(() => {
        this.userName = query.userName;
        Cookies.set('adminUserName', query.userName, { expires: 60 });
      });
    },
    async getUserInfo() {
      await user.getCurrentUser().then((res) => {
        this.userInfo = res.response;
        Cookies.set('adminUserInfo', res.response, { expires: 60 });
      });
    },
    async logout() {
      await user.logout().then(() => {
        Cookies.remove('adminUserName');
        Cookies.remove('adminUserInfo');
        router.push('/login');
      });
    },
  },
});
