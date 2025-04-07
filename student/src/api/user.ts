import { request } from '@/utils/request';

interface UserQuery {
  [key: string]: any;
}

export default {
  getUserEvent: () =>
    request.post({
      url: '/student/user/log',
    }),
  getCurrentUser: () =>
    request.post({
      url: '/student/user/current',
    }),
  update: () =>
    request.post({
      url: '/student/user/update',
    }),
  messagePageList: (query: UserQuery) =>
    request.post({
      url: '/student/user/message/page',
      data: query,
    }),
  password: (query: UserQuery) =>
    request.post({
      url: '/student/user/password',
      data: query,
    }),
  read: (id: number) =>
    request.post({
      url: `/student/user/message/read/${id}`,
    }),
  unreadCount: () =>
    request.post({
      url: '/student/user/message/unreadCount',
    }),

  logout: () =>
    request.post({
      url: '/user/logout',
    }),
  login: (query: UserQuery) =>
    request.post({
      url: '/user/login',
      data: query,
    }),
  register: (query: UserQuery) =>
    request.post({
      url: '/student/user/register',
      data: query,
    }),
};
