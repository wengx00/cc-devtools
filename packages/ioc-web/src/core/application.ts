import { ReadableStream } from 'stream/web';

export interface IHeaders {
  get(name: string): string | null | undefined;
  set(name: string, value: string): void;
  has(name: string): boolean;
  delete(name: string): void;
  entries(): IterableIterator<[string, string]>;
}

export interface IFormData {
  get(name: string): string | null | undefined;
  set(name: string, value: string): void;
  has(name: string): boolean;
  delete(name: string): void;
  entries(): IterableIterator<[string, string]>;
}

export interface IRequest {
  readonly path: string;
  readonly method: string;
  readonly url: string;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  body(): ReadableStream<any>;
  text(): Promise<string>;
  json<T>(): Promise<T>;
  formData(): Promise<IFormData>;
  headers: IHeaders;
}

export interface IApplication {
  handleHttpRequest<T = any>(request: IRequest): Promise<T> | T;
}
