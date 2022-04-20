import Link from 'next/link';
import NavTab from '@/components/book/Panel/NavTab';
import SearchContainer from '@/components/book/Panel/SearchContainer';

import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import ChipButton from '@/components/common/ChipButton';
import TeeListArea from '@/components/book/Panel/TeeListArea';
import { forwardRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// [Todo] 예약하기 탭이 활성화 되기 전에 서버사이드 렌더링을 통해 tee 정보 받아서 NavTab, tee 목록에 뿌려주기
const Panel = ({ hidden, setHidden }) => {
  const router = useRouter();
  const { ...others } = router?.query;
  const { panelStore } = useStores();

  const handleClick = e => {
    const { id } = e.target;
    console.log(id);
  };

  return (
    <>
      <div hidden={hidden}>
        <SearchContainer />
        <div className='wrapper'>
          <NavTab />
          {/*container inner */}
          <div className='inner'>
            {/*list_Areawrap 지역 골프장리스트  */}
            <div className='list_Areawrap'>
              <div className='list_Areawrap_inner'>
                {/*list_AreaTop  */}
                <div className='list_AreaTop'>
                  <span>
                    등록:<b>{panelStore.totalRegisteredTee}</b>
                  </span>
                  <ChipButton
                    id='registered'
                    color='dark'
                    padding='4px 12px'
                    radius={30}
                    onClick={handleClick}
                  >
                    {panelStore.isAllChecked.registered
                      ? '전체해제'
                      : '전체선택'}
                  </ChipButton>
                </div>
                {/*//list_AreaTop  */}
                <TeeListArea
                  teeList={panelStore.registeredTeeList}
                  registered
                />
                {/*list_AreaTop  */}
                <div className='list_AreaTop'>
                  <span>
                    미등록:
                    <b>{panelStore.totalUnregisteredTee}</b>
                  </span>
                  <ChipButton
                    id='unregistered'
                    color='dark'
                    padding='4px 12px'
                    radius={30}
                    onClick={handleClick}
                  >
                    {panelStore.isAllChecked.unregistered
                      ? '전체해제'
                      : '전체선택'}
                  </ChipButton>
                </div>
                {/*//list_AreaTop  */}
                <TeeListArea teeList={panelStore.unregisteredTeeList} />

                {/* bookingwrap 예약/대기/알림 */}
                <div className='bookingwrap'>
                  <span>
                    골프장:<b>{panelStore.totalCheckedTee}</b>
                  </span>
                  <ul className='button-list'>
                    <li className='button'>
                      <Link
                        href={{
                          href: '/home',
                          query: {
                            ...others,
                            subTab: 'tabContent01',
                            container: 'book',
                          },
                        }}
                      >
                        <a onClick={() => setHidden(true)}>실시간 예약</a>
                      </Link>
                    </li>
                    <li className='button'>
                      <Link
                        href={{
                          href: '/home',
                          query: {
                            ...others,
                            subTab: 'tabContent01',
                            container: 'wait',
                          },
                        }}
                      >
                        <a onClick={() => setHidden(true)}>예약대기</a>
                      </Link>
                    </li>
                    <li className='button'>
                      <Link
                        href={{
                          href: '/home',
                          query: {
                            ...others,
                            subTab: 'tabContent01',
                            container: 'alarm',
                          },
                        }}
                      >
                        <a onClick={() => setHidden(true)}>예약오픈 알림</a>
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* //bookingwrap 예약/대기/알림 */}
              </div>
            </div>
            {/*//list_Areawrap 지역 골프장리스트  */}
          </div>
          {/* //container inner */}
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          position: fixed;
          top: 0;
          height: 90%;
          width: 100%;
          z-index: 200;
        }
        .inner {
          height: calc(100% - 110px);
        }
        .list_Areawrap {
          height: 100%;
        }
        .list_Areawrap_inner {
          position: relative;
          overflow: auto;
          height: 100%;
          background-color: var(--white);
        }
        .list_Areawrap_inner::-webkit-scrollbar {
          display: none;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .bookingwrap {
          position: absolute;
          bottom: 4px;
          width: 100%;
          height: auto;
        }
        .button-list {
          height: auto;
          min-height: max-content;
          align-items: center;
          gap: 4px;
        }
        .button {
          height: auto;
          min-height: max-content;
        }
        .list_AreaTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </>
  );
};

export default Panel;
