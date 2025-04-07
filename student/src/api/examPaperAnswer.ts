import { request } from '@/utils/request';

interface UserQuery {
  [key: string]: any;
}

export default {
  pageList: (query?: UserQuery) =>
    request.post({
      url: '/student/exampaper/answer/pageList',
      data: query,
    }),
  answerSubmit: (query?: UserQuery) =>
    request.post({
      url: '/student/exampaper/answer/answerSubmit',
      data: query,
    }),
  read: (id: string | number) =>
    request.post({
      url: `/student/exampaper/answer/read/${id}`,
    }),
  edit: (query?: UserQuery) =>
    request.post({
      url: '/student/exampaper/answer/edit',
      data: query,
    }),
};
