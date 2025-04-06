import 'nprogress/nprogress.css'; // progress bar style

import NProgress from 'nprogress';

import router from '@/router';
import { getPermissionStore } from '@/store';

NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const permissionStore = getPermissionStore();
  await permissionStore.buildAsyncRoutes();
  next();
});

router.afterEach(() => {
  NProgress.done();
});
