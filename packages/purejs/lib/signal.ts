export type ActiveEffect = () => void;
export type Signal<T> = Record<"value", T>;

let activeEffect: null | ActiveEffect = null;

export function signal<T>(initialValue?: T) {
  let value: T | undefined = initialValue;
  const deps = new Set<ActiveEffect>();

  const proxy = new Proxy<Signal<T>>({} as any, {
    get(_, key) {
      if (key === "value") {
        if (activeEffect) {
          deps.add(activeEffect);
        }
        return value;
      }
    },
    set(_, key, newValue) {
      if (key === "value") {
        if (newValue === value) return true;
        value = newValue;
        deps.forEach((effect) => effect());
        return true;
      }
      return true;
    },
  });

  return proxy;
}

export function effect(fn: ActiveEffect) {
  activeEffect = fn;
  fn();
  activeEffect = null;
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
