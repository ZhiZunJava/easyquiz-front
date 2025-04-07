import { request } from '@/utils/request';

interface UserQuery {
  [key: string]: any;
}

export default {
  waitList: (query?: UserQuery) =>
    request.post({
      url: '/admin/examPaperAnswer/waitList',
      data: query,
    }),
  completeList: (query?: UserQuery) =>
    request.post({
      url: '/admin/examPaperAnswer/completeList',
      data: query,
    }),
  edit: (query: UserQuery) =>
    request.post({
      url: '/admin/examPaperAnswer/edit',
      data: query,
    }),
  read: (id: string | number) =>
    request.post({
      url: `/admin/examPaperAnswer/read/${id}`,
    }),
};
