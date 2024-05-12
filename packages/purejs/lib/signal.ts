/*
 * @Author: wengx00 wengx86@163.com
 * @Date: 2024-05-08 11:08:39
 * Copyright (c) 2024 by wengx00, All Rights Reserved.
 */
export type ActiveEffect = () => void;
export type Signal<T> = Record<"value", T>;

let activeEffect: null | ActiveEffect = null;

export function signal<T>(initialValue?: T) {
  const value: Signal<T | undefined> = { value: initialValue };
  const deps = new Set<ActiveEffect>();

  const proxy = new Proxy<Signal<T>>(value as any, {
    get(_, key) {
      if (key === "value") {
        if (activeEffect) {
          deps.add(activeEffect);
        }
        return Reflect.get(value, "value");
      }
    },
    set(_, key, newValue) {
      if (key === "value") {
        if (newValue === value) return true;
        Reflect.set(value, "value", newValue);
        deps.forEach((effect) => effect());
        return true;
      }
      return true;
    },
  });

  return proxy;
}

export function effect(fn: ActiveEffect) {
  const legacyEffect = activeEffect;
  activeEffect = fn;
  fn();
  activeEffect = legacyEffect;
}

export function computed<T>(fn: () => T) {
  const value = signal<T>();
  effect(() => {
    value.value = fn();
  });
  return value;
}

export function watch<T>(signal: Signal<T>, fn: (value: T) => any) {
  let firstTrigger = true;
  effect(() => {
    if (firstTrigger) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      signal.value;
      firstTrigger = false;
    } else {
      fn(signal.value);
    }
  });
}

export function watchList(signals: Signal<any>[], fn: (values: any[]) => any) {
  let firstTrigger = true;
  effect(() => {
    if (firstTrigger) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      signals.map((signal) => signal.value);
      firstTrigger = false;
    } else {
      fn(signals.map((signal) => signal.value));
    }
  });
}
