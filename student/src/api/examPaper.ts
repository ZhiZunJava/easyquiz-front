import { request } from '@/utils/request';

interface UserQuery {
  [key: string]: any;
}

export default {
  pageList: (query?: UserQuery) =>
    request.post({
      url: '/student/exam/paper/pageList',
      data: query,
    }),
  select: (id: string | number) =>
    request.post({
      url: `/student/exam/paper/select/${id}`,
    }),
  generate: (query?: UserQuery) =>
    request.post({
      url: '/student/exam/paper/generate',
      data: query,
    }),
};
