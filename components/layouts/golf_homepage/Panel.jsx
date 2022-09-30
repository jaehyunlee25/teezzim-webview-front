import Link from 'next/link';
import NavTab from '@/components/book/Panel/NavTab';
import SearchContainer from '@/components/book/Panel/SearchContainer';
import TeeListArea from '@/components/book/Panel/TeeListArea';
import TeeItem from '@/components/book/Panel/TeeItem';
import CheckController from '@/components/book/Panel/CheckController';

import useStores from '@/stores/useStores';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Counter from '@/components/book/Panel/Counter';
import { observer } from 'mobx-react-lite';
import SearchBar from '@/components/common/SearchBar';

const Panel = observer(() => {
  const router = useRouter();
  const { ...others } = router?.query;
  const { panelStore, globalStore, authStore } = useStores();

  const [tee, setTee] = useState([
    ...panelStore.registeredTeeList,
    ...panelStore.unregisteredTeeList,
  ]);

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
        setTee(data);
        mountRef.current = false;
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
  }, [getTeeList]);

  const [isInitSignalSendApp, setIsInitSignal] = useState(false); // 이 메뉴로 이동했음을 App에 알렸는지 여부
  const [savedReservationList, setSavedReservationList] = useState(null);
  const [savedWaitReservationList, setSaveWaitReservationList] = useState(null);
  const [savedOpenAlarmList, setSavedOpenAlarmList] = useState(null);

  /** APP<->WEB 브릿지 함수용 */
  useEffect(() => {
    console.log(authStore.communicated);
    if (!isInitSignalSendApp || !authStore.communicated) {
      if (window) {
        // window 존재여부 체크 (nextjs 특징)
        /** 로그인 APP->WEB 전송 */
        window.getSavedAuth = function (jsonStr) {
          console.log(jsonStr);
          // 데이터 샘플: [{"clubId":"골프장식별자","id":"아이디","password":"패스워드"}]
          const dataList = JSON.parse(jsonStr);
          panelStore.setRegisteredKeys(dataList.map(({ clubId }) => clubId));

          for (let i = 0; i < dataList.length; i++) {
            const findIndex = panelStore.teeList.findIndex(
              item => item.id == dataList[i].clubId,
            );
            if (findIndex > -1) {
              // dataList[i].name = panelStore._registeredTeeList[findIndex].name;
              dataList[i].clubInfo = panelStore.teeList[findIndex];
            }
          }
          authStore.saveAuthList(dataList);
          authStore.communicate();
          // setSavedAuthList(dataList);
        };

        // setTimeout(() => {
        //   // 웹뷰에서는 테스트 데이터로!
        //   window.getSavedAuth(
        //     `[{"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","id":"newrison","password":"ilovegolf778"}]`,
        //   );
        // }, 1000);
      }
      setIsInitSignal(true);
    }
  }, [isInitSignalSendApp, panelStore, authStore, authStore.communicated]);

  let pid;
  const registeredList = useMemo(
    () => tee.filter(({ id }) => panelStore.registeredKeys.includes(id)),
    [tee, panelStore.registeredKeys],
  );
  const unregisteredList = useMemo(
    () => tee.filter(({ id }) => !panelStore.registeredKeys.includes(id)),
    [tee, panelStore.registeredKeys],
  );
  const handleChangeKeyword = ({ name, value }) => {
    if (name !== 'keyword') return;

    search(value);
    // pid = setTimeout(
    //   () => {
    //     // console.log(`clear ${pid - 1}`);
    //     if (pid) clearTimeout(pid);
    //     setDebouncedValue(value);
    //   },
    //   1000,
    //   value,
    // );
    // console.log(`${value} pid : ${pid}`);

    return pid;
  };

  const search = useCallback(
    async keyword => {
      if (keyword === '') {
        setTee([
          ...panelStore.registeredTeeList,
          ...panelStore.unregisteredTeeList,
        ]);
        return;
      }
      const {
        status,
        data: { resultCode, message, data },
      } = await axios.get('/teezzim/teeapi/v1/club', {
        params: { keyword },
      });
      if (status === 200) {
        if (resultCode === 1) {
          setTee(data);
          console.log(tee);
        } else {
          console.warn(`[error code : ${resultCode}] ${message}`);
        }
      } else {
        console.warn(`[error code : ${status}]`);
      }
    },
    [panelStore.registeredTeeList, panelStore.unregisteredTeeList, tee],
  );

  return (
    <>
      <div className='container'>
        <SearchBar
          style={router.pathname === '/golf_homepage/panel' ? { top: 65 }:{top:44}}
          formProps={{
            onSubmit: e => e.preventDefault(),
          }}
          onChangeKeyword={handleChangeKeyword}
        />
        <div className='wrapper'>
          {/*container inner */}
          <div className='inner'>
            {/*list_Areawrap 지역 골프장리스트  */}
            <div className='list_Areawrap'>
              <div className='list_Areawrap_inner'>
                { registeredList.length > 0 &&
                  <>
                    <div className='list_AreaTop'>
                      <Counter type='registered' />
                      <hr />
                    </div>
                    <div className='list_Golfarea'>
                      <ul>
                        {registeredList
                          .sort((a, b) =>
                            a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
                          )
                          ?.map((tee, i) => (
                            <TeeItem
                              key={tee.id}
                              img={globalStore.TeeImages[i % 7]}
                              type='golf_homepage'
                              registered
                              {...tee}
                            />
                          ))}
                      </ul>
                    </div>
                  </>
                }
                <>
                  <div className='list_AreaTop'>
                    <Counter type='unregistered' />
                    <hr style={{ width: 'calc(100% - 90px)' }} />
                  </div>
                  <div className='list_Golfarea'>
                    <ul>
                      {unregisteredList
                        .sort((a, b) =>
                          a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
                        )
                        ?.map((tee, i) => (
                          <TeeItem
                            key={tee.id}
                            img={globalStore.TeeImages[i % 7]}
                            type='golf_homepage'
                            registered
                            {...tee}
                          />
                        ))}
                    </ul>
                  </div>
                </>

                {/* bookingwrap 예약/대기/알림 */}
              </div>
            </div>
            {/*//list_Areawrap 지역 골프장리스트  */}
          </div>
          {/* //container inner */}

          {/* //bookingwrap 예약/대기/알림 */}
        </div>
      </div>
      <style jsx>{`
        hr {
          width: calc(100% - 60px);
        }
        .container {
          padding-top: 44px;
        }
        .wrapper {
          padding-top: 60px;
          height: 100%;
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
