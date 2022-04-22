import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import CalenderIcon from '@/assets/images/frame/bottom/Icon_Calendar.svg';
import CheckedOutlineIcon from '@/assets/images/frame/bottom/Icon_Checed-Outline.svg';
import MenuIcon from '@/assets/images/frame/bottom/Icon_Menu.svg';

const BottomMenu = () => {
  const router = useRouter();
  const { tab, ...others } = router?.query;
  const ref = useRef(null);

  const handleOpen = e => {
    e.preventDefault();
    if (ref.current) {
      ref.current.style.width = '100%';
    }
  };

  const handleClose = e => {
    e.preventDefault();
    if (ref.current) {
      ref.current.style.width = '0%';
    }
  };

  useEffect(() => {
    // rendering시 초기화
    if (ref.current) {
      ref.current.style.width = '0%';
    }
  }, [router]);

  const openNativePage = name => {
    // console.log(name);
    if (window && window.BRIDGE && window.BRIDGE.openNativePage) {
      window.BRIDGE.openNativePage(name);
    } else {
      alert('이 기능은 앱에서만 수행 가능합니다.');
    }
  };

  return (
    <>
      <div id='myNav' className='overlay' ref={ref}>
        <a href='#' className='closebtn' onClick={handleClose}>
          &times;
        </a>
        <div className='overlay-content'>
          <h1 className='logo'>티찜</h1>
          <a href='#' onClick={e => openNativePage('MyScore')}>
            나의기록
          </a>
          <a href='#' onClick={e => openNativePage('ScreenLock')}>
            화면잠금
          </a>
          <a href='#' onClick={e => openNativePage('Notification')}>
            알림
          </a>
          <a href='#' onClick={e => openNativePage('Backup')}>
            백업
          </a>
          <ul>
            <li>
              ÷<Link href='#'>골프장 홈페이지 바로가기</Link>
            </li>
            <li>
              <Link href='#'>이 앱 평가하기</Link>
            </li>
            <li>
              <Link href='#'>이 앱 추천하기</Link>
            </li>
            <li>
              <Link href='#'>이 앱에 관하여...</Link>
            </li>
          </ul>
        </div>
      </div>

      <div id='footer'>
        <div className='inner'>
          <div className='tabbar'>
            <ul>
              <li className={tab !== 'my_book' ? 'icon-tab on' : 'icon-tab'}>
                <Link
                  href={{ href: '/home', query: { ...others, tab: 'book' } }}
                  passHref
                >
                  <div>
                    <Image
                      src={CalenderIcon}
                      alt='예약하기'
                      className={
                        tab !== 'my_book' ? 'menu-icon on' : 'menu-icon'
                      }
                    />
                    <span>예약하기</span>
                  </div>
                </Link>
              </li>
              <li className={tab === 'my_book' ? 'icon-tab on' : 'icon-tab'}>
                <Link
                  href={{ href: '/home', query: { ...others, tab: 'my_book' } }}
                  passHref
                >
                  <div>
                    <Image
                      src={CheckedOutlineIcon}
                      alt='나의 예약'
                      className={
                        tab === 'my_book' ? 'menu-icon on' : 'menu-icon'
                      }
                    />
                    <span>나의 예약</span>
                  </div>
                </Link>
              </li>
              {/* menu button 누르면 navigation menu 열기 */}
              <li onClick={handleOpen}>
                <div>
                  <Image src={MenuIcon} alt='메뉴' />
                  <span>메뉴</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          #myNav {
            z-index: 400;
          }
          #footer {
            position: relative;
          }
          #footer .inner {
          }
          /*하단고정*/
          .tabbar {
            width: 100%;
            position: fixed;
            bottom: 0px;
            background: #fff;
            margin: 0 auto;
            left: 0;
            right: 0;
            border-top: 1px solid #e0e0e0;
          }
          .tabbar {
            padding: 4px 0 calc(constant(safe-area-inset-bottom) + 8px);
            padding: 4px 0 calc(env(safe-area-inset-bottom) + 8px);
          }
          .tabbar:afrer {
            content: '';
            display: inline-block;
            clear: both;
          }
          .tabbar ul {
            margin: 0 16px;
            text-align: center;
          }
          .tabbar li {
            display: inline-block;
            width: 32%;
            height: 45px;
            font-family: AppleSDGothicNeo-SemiBold;
            margin-top: 3px;
          }
          .tabbar li div.on {
            background: #115b40;
            display: inline-block;
            width: 72px;
            height: 45px;
            border-radius: 4px;
          }
          .tabbar li div.on span {
            color: #fff;
          }
          .tabbar li span {
            display: block;
            color: #323233;
            font-weight: 600;
            line-height: 1.3;
            font-size: 13px;
          }
          li div {
            cursor: pointer;
          }
          li.icon-tab.on div {
            width: fit-content;
            padding: 2px 8px;
            border-radius: 4px;
            margin: 0 auto;
            background-color: var(--brand-primary);
          }

          li.icon-tab.on span {
            color: var(--neutrals-white);
          }
        `}
      </style>
      <style jsx global>{`
        img.menu-icon.on {
          filter: brightness(0) invert(1);
        }
      `}</style>
    </>
  );
};

export default BottomMenu;
