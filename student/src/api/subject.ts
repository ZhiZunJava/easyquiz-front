import { request } from '@/utils/request';

interface UserQuery {
  [key: string]: any;
}

export default {
  list: (query?: UserQuery) =>
    request.post({
      url: '/student/education/subject/list',
      data: query,
    }),
  select: (id: string | number) =>
    request.post({
      url: `/student/education/subject/select/${id}`,
    }),
};
