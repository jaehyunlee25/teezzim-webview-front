import Book from '@/components/layouts/book';
import useStores from '@/stores/useStores';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { globalStore } = useStores();
  const router = useRouter();

  // 안드로이드 공통함수 선언
  useEffect(() => {
    if (window) {
      /** APP->WEB */
      window.globalFunction = function (jsonStr) {
        console.log(jsonStr);
        try {
          const params = JSON.parse(jsonStr);
        } catch (error) {
          console.log(error);
        }
        // TODO .. 
      };
      /** WEB->APP */
      if (window.BRIDGE && window.BRIDGE.globalMethod) {
        const params = { prop1: 0,  prop2: 1 };
        window.BRIDGE.globalMethod(JSON.stringify(params));
      }
    }
  }, []);
  
  return (
    <>
      <Book />
    </>
  );
}
