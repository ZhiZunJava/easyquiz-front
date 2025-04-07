import { request } from '@/utils/request';

interface UserQuery {
  [key: string]: any;
}

export default {
  pageList: (query: UserQuery) =>
    request.post({
      url: '/admin/question/answer/page',
      data: query,
    }),
  select: (id: string | number) =>
    request.post({
      url: `/admin/question/answer/select/${id}`,
    }),
};
