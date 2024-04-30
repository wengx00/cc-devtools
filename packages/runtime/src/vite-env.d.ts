/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_PREFIX: string; // api前缀
  readonly VITE_BASE: string; // 根路径
  readonly VITE_DEV_PORT: string; // 开发服务器的运行端口

  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_AUTHOR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'app-version' {
  const VERSION: string;
  export default VERSION;
}
