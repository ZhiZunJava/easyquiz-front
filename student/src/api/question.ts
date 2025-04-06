import { request } from '@/utils/request';

interface UserQuery {
  [key: string]: any;
}

export default {
  pageList: (query: UserQuery) =>
    request.post({
      url: '/admin/question/page',
      data: query,
    }),
  edit: (query: UserQuery) =>
    request.post({
      url: '/admin/question/edit',
      data: query,
    }),
  select: (id: string | number) =>
    request.post({
      url: `/admin/question/select/${id}`,
    }),
  deleteQuestion: (id: string | number) =>
    request.post({
      url: `/admin/question/delete/${id}`,
    }),
};
