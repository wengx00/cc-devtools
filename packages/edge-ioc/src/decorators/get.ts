import Request from './request';

export default function Get(path: string) {
  return Request(path, 'GET');
}
