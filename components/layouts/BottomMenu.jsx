import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import CalenderIcon from '@/assets/images/frame/bottom/Icon_Calendar.svg';
import CheckedOutlineIcon from '@/assets/images/frame/bottom/Icon_Checed-Outline.svg';
import MenuIcon from '@/assets/images/frame/bottom/Icon_Menu.svg';
import CalenderIconOn from '@/assets/images/frame/bottom/Icon_Calendar_On.svg';
import CheckedOutlineIconOn from '@/assets/images/frame/bottom/Icon_Checed-Outline_On.svg';

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
    } else if (window.webkit && window.webkit.messageHandlers ) {
      window.webkit.messageHandlers.openNativePage.postMessage(name);
    } else {
      alert('이 기능은 앱에서만 수행 가능합니다.');
    }
  };

  return (
    <>
      <div id='myNav' className='overlay' ref={ref}>
        <a className='closebtn' onClick={handleClose}>
          &times;
        </a>
        <div className='overlay-content'>
          <h1 className='logo'>티찜</h1>
          <a
            onClick={e => {
              e.preventDefault();
              openNativePage('MyScore');
            }}
          >
            나의기록
          </a>
          <a
            onClick={e => {
              e.preventDefault();
              openNativePage('ScreenLock');
            }}
          >
            화면잠금
          </a>
          <a
            onClick={e => {
              e.preventDefault();
              openNativePage('Notification');
            }}
          >
            알림
          </a>
          <a
            onClick={e => {
              e.preventDefault();
              openNativePage('Backup');
            }}
          >
            백업
          </a>
          <ul>
            <li>
              <Link href='/golf_homepage/panel'>골프장 홈페이지 바로가기</Link>
            </li>
            <li>
              <Link href='/home'>이 앱 평가하기</Link>
            </li>
            <li>
              <Link href='/home'>이 앱 추천하기</Link>
            </li>
            <li>
              <Link href='/home'>이 앱에 관하여...</Link>
            </li>
          </ul>
        </div>
      </div>

      <div id='footer'>
        <div className='inner'>
          <div className='tabbar'>
            <ul>
              <li className={tab !== 'my_book' ? 'icon-tab on' : 'icon-tab'}>
                <div
                  onClick={() =>
                    router.push({
                      pathname: '/home',
                      query: { ...others, tab: 'book' },
                    })
                  }
                >
                  <Image
                    src={tab !== 'my_book' ? CalenderIconOn : CalenderIcon}
                    alt='예약하기'
                  />
                  <span>예약하기</span>
                </div>
              </li>
              <li className={tab === 'my_book' ? 'icon-tab on' : 'icon-tab'}>
                <div
                  onClick={() =>
                    router.push({
                      pathname: '/reserve',
                      query: { ...others, tab: 'my_book' },
                    })
                  }
                >
                  <Image
                    src={tab === 'my_book' ? CheckedOutlineIconOn : CheckedOutlineIcon}
                    alt='나의 예약'
                  />
                  <span>나의 예약</span>
                </div>
              </li>
              {/* menu button 누르면 navigation menu 열기 */}
              <li onClick={handleOpen}>
                <div>
                  <Image src={MenuIcon}
                    alt='메뉴'
                  />
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
            position: sticky;
            bottom: 0;
          }
          #footer .inner {
          }
          /*하단고정*/
          .tabbar {
            width: 100%;
            background: #fff;
            margin: 0 auto;
            border-top: 1px solid #e0e0e0;
            width: 100%;
            position: fixed;
            bottom:0px;
            background: #f4f4f4;
            margin: 0 auto;
            left: 0;
            right: 0;
            border-top: 1px solid #e0e0e0;
          }
          .tabbar {
            padding: 0px 0 calc(constant(safe-area-inset-bottom) + 3px);
            padding: 0px 0 calc(env(safe-area-inset-bottom) + 3px);
          }
          .tabbar:afrer {
            content: '';
            display: inline-block;
            clear: both;
          }
          .tabbar ul {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 16px;
            text-align: center;
            padding: 15px 0;
          }
          .tabbar li {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            grid-gap: 10px;
            width: 32%;
            height: auto;
            min-height: 45px;
            font-family: Spoqa Han Sans Neo;
            margin-top: 3px;
          }
          .tabbar li div.on {
            width: 72px;
            height: auto;
            border-radius: 4px;
          }
          .tabbar li div.on span {
            color: #fff;
          }
          .tabbar li span {
            display:block;
            color: #323233;
            font-weight: 500;
            line-height: 1.3;
            font-size: 13px;
          }
          li div {
            height: auto;
            display: inline-flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            grid-gap: 10px;
          }
          li.icon-tab.on div {
            width: fit-content;
            padding: 2px 8px;
            border-radius: 4px;
            margin: 0 auto;
          }
        `}
      </style>
    </>
  );
};

export default BottomMenu;
