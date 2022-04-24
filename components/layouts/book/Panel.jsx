import Link from 'next/link';
import NavTab from '@/components/book/Panel/NavTab';
import SearchContainer from '@/components/book/Panel/SearchContainer';
import TeeListArea from '@/components/book/Panel/TeeListArea';
import CheckController from '@/components/book/Panel/CheckController';

import useStores from '@/stores/useStores';
import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Counter from '@/components/book/Panel/Counter';
import { observer } from 'mobx-react-lite';

// TODO 예약하기 탭이 활성화 되기 전에 서버사이드 렌더링을 통해 tee 정보 받아서 NavTab, tee 목록에 뿌려주기
const Panel = observer(({ hidden, setHidden }) => {
  const router = useRouter();
  const { ...others } = router?.query;
  const { panelStore } = useStores();

  const mountRef = useRef(true);
  const getTeeList = useCallback(async () => {
    const {
      status,
      data: { resultCode, message, data },
    } = await axios.get('/teezzim/teeapi/v1/club');
    if (!mountRef.current) return;
    if (status === 200) {
      if (resultCode === 1) {
        panelStore.setTeeList(data);
      } else {
        console.warn(`[error code : ${resultCode}] ${message}`);
      }
    } else {
      console.warn(`[error code : ${status}]`);
    }
  }, [panelStore]);

  useEffect(() => {
    mountRef.current = true;
    getTeeList();
    return () => {
      mountRef.current = false;
    };
  }, []);

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
                {!panelStore.filter &&
                panelStore.registeredTeeList.length <= 0 ? null : (
                  <>
                    <div className='list_AreaTop'>
                      <Counter type='registered' />
                      <CheckController type='registered' />
                    </div>
                    <TeeListArea
                      registered
                      list={panelStore.registeredTeeList}
                    />
                  </>
                )}

                {!panelStore.filter &&
                panelStore.unregisteredTeeList.length <= 0 ? null : (
                  <>
                    <div className='list_AreaTop'>
                      <Counter type='unregistered' />
                      <CheckController type='unregistered' />
                    </div>
                    <TeeListArea list={panelStore.unregisteredTeeList} />
                  </>
                )}
                {/* bookingwrap 예약/대기/알림 */}
              </div>
            </div>
            {/*//list_Areawrap 지역 골프장리스트  */}
          </div>
          {/* //container inner */}
          <div className='bookingwrap'>
            <Counter type='checked' />
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
      <style jsx>{`
        .wrapper {
          position: fixed;
          top: 0;
          height: 80%;
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
          // border-bottom-right-radius: 20px;
          // border-bottom-left-radius: 20px;
        }
        .list_Areawrap_inner::-webkit-scrollbar {
          display: none;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .bookingwrap {
          position: absolute;
          bottom: -71px;
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
        .list_AreaTop span > b {
          padding: 0px;
        }
      `}</style>
    </>
  );
});

export default Panel;
