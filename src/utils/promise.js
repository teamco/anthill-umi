import React, { useEffect, useRef } from 'react';

/**
 * @export
 * @param {number} ts
 * @return {Promise<unknown>}
 */
export const asyncFn = (ts = 0) => {
  return new Promise(resolve => setTimeout(() => resolve('Async'), ts));
};

/**
 * @export
 * @param asyncFn
 * @param onSuccess
 */
export function useAsync(asyncFn, onSuccess) {
  useEffect(() => {
    let isActive = true;
    asyncFn().then(data => {
      if (isActive) onSuccess(data);
      else console.log('Aborted on unmounted component');
    });
    return () => {
      isActive = false;
    };
  }, [asyncFn, onSuccess]);
}

/**
 * @export
 * @param deps
 * @return {React.MutableRefObject<boolean>}
 */
export function useIsMounted(deps = []) {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, [deps]);

  return isMounted;
}
