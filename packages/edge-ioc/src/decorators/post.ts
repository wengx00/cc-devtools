import Request from './request';

export default function Post(path: string) {
  return Request(path, 'post');
}
