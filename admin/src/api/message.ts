import { request } from '@/utils/request';

interface UserQuery {
  [key: string]: any;
}

export default {
  pageList: (query: UserQuery) =>
    request.post({
      url: '/admin/message/page',
      data: query,
    }),
  send: (query: UserQuery) =>
    request.post({
      url: '/admin/message/send',
      data: query,
    }),
};
