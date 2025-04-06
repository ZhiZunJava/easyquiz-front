import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';

import router, { fixedRouterList, homepageRouterList } from '@/router';
import { store } from '@/store';

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    whiteListRouters: ['/login'],
    routers: [] as Array<RouteRecordRaw>,
    removeRoutes: [],
    asyncRoutes: [] as any,
  }),
  actions: {
    async initRoutes() {
      // 在菜单展示全部路由
      this.routers = [...homepageRouterList, ...fixedRouterList];
    },
    async buildAsyncRoutes() {
      try {
        await this.initRoutes();
      } catch (error) {
        throw new Error("Can't build routes");
      }
    },
    async restoreRoutes() {
      // 不需要在此额外调用initRoutes更新侧边导肮内容，在登录后asyncRoutes为空会调用
      this.asyncRoutes.forEach((item: RouteRecordRaw) => {
        if (item.name) {
          router.removeRoute(item.name);
        }
      });
      this.asyncRoutes = [];
    },
  },
});

export function getPermissionStore() {
  return usePermissionStore(store);
}
