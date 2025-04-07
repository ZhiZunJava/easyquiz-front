import { request } from '@/utils/request';

interface UserQuery {
  [key: string]: any;
}

export default {
  getUserPageList: (query: UserQuery) =>
    request.post({
      url: '/admin/user/page/list',
      data: query,
    }),
  getUserEventPageList: (query: UserQuery) =>
    request.post({
      url: '/admin/user/event/page/list',
      data: query,
    }),
  createUser: (query: UserQuery) =>
    request.post({
      url: '/admin/user/edit',
      data: query,
    }),
  selectUser: (id: string | number) =>
    request.post({
      url: `/admin/user/select/${id}`,
    }),
  getCurrentUser: () =>
    request.post({
      url: '/admin/user/current',
    }),
  updateUser: (query: UserQuery) =>
    request.post({
      url: '/admin/user/update',
      data: query,
    }),
  changeStatus: (id: string | number) =>
    request.post({
      url: `/admin/user/changeStatus/${id}`,
    }),
  deleteUser: (id: string | number) =>
    request.post({
      url: `/admin/user/delete/${id}`,
    }),
  selectByUserName: (query: UserQuery) =>
    request.post({
      url: '/admin/user/selectByUserName',
      data: query,
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
