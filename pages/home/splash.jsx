import Image from 'next/image';
import SymbolLogoType from '@/assets/images/Symbol_Logotype.svg';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Splash() {
  const router = useRouter();
  // [Todo] 임시 데이터 Bridge 또는 Custom Event 등록을 통해 업데이트 내용 받아와서 state 변동시키기
  const [totalItems, setTotalItems] = useState(40);
  const [downloadedItems, setDownloadedItems] = useState(0);

  // 임시 동작
  useEffect(() => {
    let pid;
    pid = setInterval(() => {
      if (totalItems > downloadedItems) setDownloadedItems(prev => prev + 4);
      else {
        clearInterval(pid);
        router.push('/home');
      }
    }, 1000);
    return () => clearInterval(pid);
  }, [totalItems, downloadedItems, router]);

  return (
    <>
      <div id='wrap'>
        {/* container */}
        <div id='container' className='main-bg'>
          {/*  mainwrap 메인로딩이미지 */}
          <div className='mainwrap'>
            {/*  main-top */}
            <div className='main-top'>
              <h1 className='logo'>
                <Image src={SymbolLogoType} alt='logo' />
              </h1>
            </div>
            {/*  //main-top */}

            <div className='message-box loading-box loading-boxplus'>
              <div className='loading-box'>
                <div className='loading-icon'>
                  <span className='offscreen'>스케줄을 다운로드 중입니다.</span>
                </div>
                <div className='loading-text  text-white'>
                  스케줄을 다운로드 중입니다.
                  <span>{`(${downloadedItems}/${totalItems})`}</span>
                </div>
              </div>
            </div>
          </div>
          {/*  //mainwrap 메인로딩이미지 */}
        </div>
        {/* //container */}
      </div>
      <style jsx>{`
        .loading-box {
          align-items: normal;
        }
        .loading-text.text-white {
          margin-left: 5px;
        }
        .loading-text.text-white > span {
          display: block;
          line-height: 1.5;
        }
      `}</style>
    </>
  );
}
