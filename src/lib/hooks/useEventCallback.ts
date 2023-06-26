import { useLayoutEffect, useMemo, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn<ARGS extends any[], R> = (...args: ARGS) => R;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useEventCallback = <A extends any[], R>(fn: Fn<A, R>): Fn<A, R> => {
  const ref = useRef<Fn<A, R>>(fn);
  useLayoutEffect(() => {
    ref.current = fn;
  });
  return useMemo(
    () =>
      (...args: A): R => {
        const { current } = ref;
        return current(...args);
      },
    []
  );
};

export default useEventCallback;
