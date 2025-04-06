import { request } from '@/utils/request';

interface UserQuery {
  [key: string]: any;
}

export default {
  list: (query?: UserQuery) =>
    request.post({
      url: '/admin/education/subject/list',
      data: query,
    }),
  pageList: (query: UserQuery) =>
    request.post({
      url: '/admin/education/subject/page',
      data: query,
    }),
  edit: (query: UserQuery) =>
    request.post({
      url: '/admin/education/subject/edit',
      data: query,
    }),
  select: (id: string | number) =>
    request.post({
      url: `/admin/education/subject/select/${id}`,
    }),
  deleteSubject: (id: string | number) =>
    request.post({
      url: `/admin/education/subject/delete/${id}`,
    }),
};
