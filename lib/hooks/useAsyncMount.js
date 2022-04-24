import { useEffect, useRef } from 'react';

export default function useAsyncMount(asyncFunc) {
  const mountRef = useRef(false);

  useEffect(() => {
    mountRef.current = true;
    asyncFunc();
    return () => {
      mountRef.current = false;
    };
  }, []);

  return { mountRef };
}
