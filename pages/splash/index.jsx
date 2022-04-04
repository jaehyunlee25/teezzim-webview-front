import { useRouter } from 'next/router';
import Image from 'next/image';
import SymbolLogoTypeLogo from '@/assets/images/Symbol_Logotype.svg';
import { useEffect } from 'react';

export default function Splash() {
  const router = useRouter();
  // [Todo] Android로 함수 전달하기(정보 받아와서 정보에 따라 화면 넘기기)

  // useEffect(() => {
  //   // 설계서에 따르면, 초기 사용자에게만 /carousel 로 이동하고
  //   // 아닌경우 기존 정보를 받아서 예약대기 만료 확인 화면으로 이동
  //   // 임시로 초기사용자임을 가정하고 2초 후 화면 이동
  //   setTimeout(() => {
  //     router.push('/carousel');
  //   }, 2000);
  // }, [router]);
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
                <Image src={SymbolLogoTypeLogo} alt='logo' />
              </h1>
            </div>
            {/*  //main-top */}
          </div>
          {/*  //mainwrap 메인로딩이미지 */}
        </div>
        {/* //container */}
      </div>
    </>
  );
}
