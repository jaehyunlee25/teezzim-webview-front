import { useState } from 'react';
import Image from 'next/image';

import LogoSmall from '@/assets/images/logosmall.svg';
import Account1 from '@/assets/images/carousel/account_01.svg';
import Account2 from '@/assets/images/carousel/account_02.svg';
import Account3 from '@/assets/images/carousel/account_03.svg';
import Account4 from '@/assets/images/carousel/account_04.svg';
import Account5 from '@/assets/images/carousel/account_05.svg';
import Account6 from '@/assets/images/carousel/account_06.svg';
import Arrow from '@/assets/images/carousel/Arrow.svg';
import CarouselTemplate from '@/assets/images/carousel/carousel_template.svg';
import SymbolLogoTypeLogo from '@/assets/images/Symbol_Logotype.svg';
import { useRouter } from 'next/router';

export default function Carousel() {
  const router = useRouter();
  const [carouselPage, setCarouselPage] = useState(0);

  const handleCarouselPage = page => {
    setCarouselPage(page);
  };

  const handleCarouselPageNext = () => {
    setCarouselPage(prev => prev + 1);
  };

  const handleCarouselPagePrev = () => {
    setCarouselPage(prev => (prev >= 1 ? prev - 1 : 0));
  };

  const carouselLayout = [
    {
      id: 0,
      title: <>흩어진 골프장 계정</>,
      container: 'bg-primary',
      carouselInner: (
        <>
          <div className='carousel_img'>
            <ul>
              <li className='com-img carousel_img01'>
                <Image src={Account1} alt='' />
              </li>
              <li className='com-img carousel_img02'>
                <Image src={Account4} alt='' />
              </li>
              <li className='com-img carousel_img03'>
                <Image src={Account3} alt='' />
              </li>
              <li className='com-img carousel_img04'>
                <Image src={Account2} alt='' />
              </li>
              <li className='com-img carousel_img05'>
                <Image src={Account6} alt='' />
              </li>
              <li className='com-img carousel_img06'>
                <Image src={Account5} alt='' />
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      id: 1,
      title: <>통합해서 확인하고</>,
      container: 'bg-secondary',
      carouselInner: (
        <>
          <div className=''>
            <ul>
              <li>
                <Image src={Account1} alt='' />
              </li>
              <li>
                <Image src={Account2} alt='' />
              </li>
              <li>
                <Image src={Account3} alt='' />
              </li>
              <li>
                <Image src={Account4} alt='' />
              </li>
              <li>
                <Image src={Account5} alt='' />
              </li>
              <li>
                <Image src={Account6} alt='' />
              </li>
            </ul>
          </div>

          <div className=''>
            <Image src={Arrow} alt='' />
          </div>
          <div className=''>
            <Image src={CarouselTemplate} alt='' />
          </div>
        </>
      ),
    },
    {
      id: 2,
      title: (
        <>
          <span className='text-primary'>예약</span>에서
          <br />
          <span className='text-primary'>스케줄 관리</span>까지!
        </>
      ),
      container: 'main-bg02',
      carouselInner: <></>,
    },
  ];
  return (
    <>
      <div id='wrap'>
        {/* container */}
        <div id='container' className={carouselLayout[carouselPage].container}>
          {/*  mainwrap 메인로딩이미지 */}
          <div className='mainwrap'>
            <div className='splash-text'>
              <p className={carouselPage < 2 ? 'alignMiddle' : ''}>
                {carouselPage !== 2 && (
                  <Image
                    src={LogoSmall}
                    alt='logo'
                    width='50px'
                    height='50px'
                  />
                )}
                {carouselLayout[carouselPage].title}
              </p>
            </div>
          </div>
          {/*  //mainwrap 메인로딩이미지 */}

          {/* main-top */}
          {carouselPage === 2 && (
            <div className='main-top'>
              <h1 className='spalsh'>
                <Image src={SymbolLogoTypeLogo} alt='logo' />
              </h1>
            </div>
          )}
          {/* //main-top */}

          <div className='carousel_wrap'>
            {carouselLayout[carouselPage].carouselInner}

            {/* slide-button 위치 지정 */}
            <div className='slide-button'>
              {carouselPage >= 1 && (
                <div
                  className='button prev'
                  onClick={handleCarouselPagePrev}
                ></div>
              )}
              {carouselPage < 2 && (
                <div
                  className='button next on'
                  onClick={handleCarouselPageNext}
                ></div>
              )}
              <ul>
                {[0, 1, 2].map(v => (
                  <li
                    key={v}
                    className={carouselPage !== v ? `spot` : `spot on`}
                    onClick={() => handleCarouselPage(v)}
                  ></li>
                ))}
              </ul>
            </div>
            {/* //slide-button 위치 지정 */}
          </div>
        </div>
        {/* //mainwrap 메인로딩이미지 */}
        {carouselPage === 2 && (
          <div className='btn-apply btn-apply_fix'>
            <div className='Buttonwrap'>
              <span className='fl bg-shade2 text-white'>복원</span>
              <span
                className='fl bg-action text-white'
                onClick={() => router.push('/home')}
              >
                골프장 계정 등록하기
              </span>
            </div>
          </div>
        )}

        {/* //container */}
      </div>
      <style jsx>
        {`
          img {
            width: 100%;
            vertical-align: top;
            margin: 0 auto;
          }

          .carousel_wrap > div {
            margin: 0;
          }

          span.fl.bg-shade2.text-white {
            width: 30%;
          }
          span.fl.bg-action.text-white {
            width: 70%;
          }

          p.alignMiddle {
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }

          .slide-button > ul {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 28px;
            gap: 4px;
          }
        }
        `}
      </style>
    </>
  );
}
