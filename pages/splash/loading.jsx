import { useRouter } from 'next/router';
import Image from 'next/image';
import SymbolLogoTypeLogo from '@/assets/images/Symbol_Logotype.svg';
import { useEffect } from 'react';

export default function Loading() {
  const router = useRouter();
  useEffect(() => {
    // 설계서에 따르면, 초기 사용자에게만 /splash로 이동하고
    // 아닌경우 기존 정보를 받아서 예약대기 만료 확인 화면으로 이동

    // 아래는 Native 서버 연결 시도 코드 및 서비스 상태를 확인하는 코드가 들어갈 예정
    setTimeout(() => {
      router.push('/splash');
    }, 2000);
  }, [router]);
  return (
    <>
      <div id='wrap'>
        {/* header */}
        <div id='header'></div>
        {/*  //header */}

        {/* container */}
        <div id='container' className='main-bg'>
          {/*  mainwrap 메인로딩이미지 */}
          <div className='mainwrap'>
            {/*  main-top */}
            <div className='main-top'>
              <h1 className='logo'>
                <Image src='../assets/images/Symbol_Logotypo.svg' alt='logo' />
              </h1>
            </div>
            {/*  //main-top */}
          </div>
          {/*  //mainwrap 메인로딩이미지 */}
        </div>
        {/* //container */}

        <div id='footer'></div>
      </div>

      <style jsx>
        {`
          #wrap {
            height: 100%;
          }
        `}
      </style>
    </>
  );
}
