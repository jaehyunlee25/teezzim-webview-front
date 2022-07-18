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
      /** WEB->APP (호출의예) */
      const params = { prop1: 0,  prop2: 1 };
      if (window.BRIDGE && window.BRIDGE.globalMethod) {
        window.BRIDGE.globalMethod(JSON.stringify(params));
      } else if (window.webkit && window.webkit.messageHandlers ) {
        window.webkit.messageHandlers.globalMethod.postMessage(JSON.stringify(params));
      }
    }
  }, []);
  
  return (
    <>
      <Book />
    </>
  );
}
