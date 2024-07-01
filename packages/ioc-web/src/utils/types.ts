export type Constructor<T> = new (...args: any[]) => T;

export type Pipeline = (
  value: any,
  constructor: Constructor<any>,
) => Promise<any>;

export interface OnModuleInit {
  onModuleInit(): Promise<void> | void;
}
