import { useState } from 'react';

export type ApiMethod<T, K> = (data: T, ...args: any[]) => Promise<K>;

export function getApiHook(options?: {
  loading?: () => () => any;
  notify?: (msg: string, type: 'success' | 'error') => any;
}) {
  const { loading, notify } = options || {};
  return function useApi<T = void, K = null>(
    api: ApiMethod<T, K>,
    options?: {
      showLoading?: boolean; // 默认true
      successMsg?: string;
    },
  ): [K, (param: T, ...args: any[]) => Promise<K>] {
    const [result, setResult] = useState<K>();
    return [
      result!,
      async (param, ...args) => {
        let loader = () => {};
        if (options?.showLoading !== false && loading) {
          loader = loading();
        }
        try {
          const res = await api(param, ...args);
          setResult(res);
          loader();
          if (options?.successMsg && notify) {
            notify(options.successMsg, 'success');
          }
          return res;
        } catch (err: any) {
          loader?.();
          throw err;
        }
      },
    ];
  };
}
