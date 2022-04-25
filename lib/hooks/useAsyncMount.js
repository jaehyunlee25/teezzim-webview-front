import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function useAsyncMount(asyncFunc) {
  const mountRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    mountRef.current = true;
    asyncFunc();
    return () => {
      mountRef.current = false;
    };
  }, [router.query, asyncFunc]);

  return { mountRef };
}
