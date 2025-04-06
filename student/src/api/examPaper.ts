import { request } from '@/utils/request';

interface UserQuery {
  [key: string]: any;
}

export default {
  pageList: (query?: UserQuery) =>
    request.post({
      url: '/admin/exam/paper/page',
      data: query,
    }),
  edit: (query: UserQuery) =>
    request.post({
      url: '/admin/exam/paper/edit',
      data: query,
    }),
  select: (id: string | number) =>
    request.post({
      url: `/admin/exam/paper/select/${id}`,
    }),
  deletePaper: (id: string | number) =>
    request.post({
      url: `/admin/exam/paper/delete/${id}`,
    }),
};
