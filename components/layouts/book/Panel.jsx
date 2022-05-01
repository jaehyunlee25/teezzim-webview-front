import Link from 'next/link';
import NavTab from '@/components/book/Panel/NavTab';
import SearchContainer from '@/components/book/Panel/SearchContainer';
import TeeListArea from '@/components/book/Panel/TeeListArea';
import CheckController from '@/components/book/Panel/CheckController';

import useStores from '@/stores/useStores';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Counter from '@/components/book/Panel/Counter';
import { observer } from 'mobx-react-lite';
import teeScheduleStore from '@/stores/teeScheduleStore';

const Panel = observer(() => {
  const router = useRouter();
  const { ...others } = router?.query;
  const { panelStore, authStore, toastStore } = useStores();

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
    if (!isInitSignalSendApp) {
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
        /** 예약 정보 APP->WEB 전송 */
        window.getSavedReservation = function (jsonStr) {
          const data = JSON.parse(jsonStr);
          setSavedReservationList(data);

          const reducedData = data.reduce(
            (acc, v) => ({
              ...acc,
              [v.clubId]: [
                ...(acc?.[v.clubId] || []),
                { ...v, reserved_date: v.reserved_date.replace('.', '-') },
              ],
            }),
            {},
          );
          // console.log(reducedData);
          teeScheduleStore.setReservedSchedules(reducedData);
          /* 예상 구조
            [
              {
                "clubId": "골프장식별자",
                "reserved_date": "2022.05.09",
                "reserved_time": "05:25",
                "reserved_course": "SOUTH"
              },
              // ... 반복
            ]
          */
        };

        /** 예약 대기 정보 APP->WEB 전송 */
        window.getSavedWaitReservation = function (jsonStr) {
          const data = JSON.parse(jsonStr);
          setSaveWaitReservationList(data);
          /* 예상 구조
            [
              {
                "clubId": "골프장식별자",
                "waitDate": "날짜",
                "waitTime": "시간"
              },
              // ... 반복
            ]
          */
        };
        /** 오픈 알림 정보 APP->WEB 전송 */
        window.getSavedOpenAlarm = function (jsonStr) {
          const data = JSON.parse(jsonStr);
          setSavedOpenAlarmList(data);
          /* 예상 구조
            [
              {
                "clubId": "골프장id",
                "alarmDate": "알람설정 일",
                "alarmTime": "알람설정 시간",
              },
              // ... 반복
            ]
          */
        };

        /** 예약하기 탭 열림완료 WEB->APP 전송 */
        if (window.BRIDGE && window.BRIDGE.openWebMenu) {
          setTimeout(() => {
            window.BRIDGE.openWebMenu('Reservation');
          }, 100); // 약간 지연
        } else {
          setTimeout(() => {
            // 웹뷰에서는 테스트 데이터로!
            window.getSavedAuth(
              `[{"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","id":"newrison","password":"ilovegolf778"}]`,
            );
            window.getSavedReservation(
              `[{"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","reserved_date":"2022.05.25","reserved_time":"05:12","reserved_course": "EAST"}]`,
            );
            window.getSavedWaitReservation(
              `[{"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","waitDate":"2022-05-12","waitTime":["05:22:00","05:29:00","05:22:00","16:13:00","05:22:00","05:29:00"]}]`,
            );
            window.getSavedOpenAlarm(
              `[{"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","alarmDate":"2022-05-27"}]`,
            );
          }, 1000);
        }
      }
      setIsInitSignal(true);
    }
  }, [isInitSignalSendApp, panelStore, authStore]);

  const handleSelectContainer = e => {
    const selectedLength = panelStore.checkedTeeList.size;
    const { id } = e.target;
    if (!id) return;
    if (id !== 'book' && id !== 'wait' && id !== 'alarm') return;

    if (selectedLength <= 0) {
      toastStore.setMessage('골프장을 1개 이상 선택해 주세요.');
      toastStore.setHidden(false);
      return;
    }

    if (id === 'wait' || id === 'alarm') {
      if (selectedLength > 5) {
        toastStore.setMessage(
          <>
            5개 이하의 골프장에서만
            <br /> 예약{id === 'wait' ? '대기' : '오픈알림'}을 할 수 있습니다.
          </>,
        );
        toastStore.setHidden(false);
        return;
      }
    }

    router.push({
      href: '/home',
      query: {
        ...others,
        subTab: 'tabContent01',
        container: id,
      },
    });
    panelStore.setPanelHidden(true);
  };

  return (
    <>
      <div hidden={panelStore.panelHidden}>
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
              <li id='book' className='button' onClick={handleSelectContainer}>
                실시간 예약
              </li>
              <li id='wait' className='button' onClick={handleSelectContainer}>
                예약대기
              </li>
              <li id='alarm' className='button' onClick={handleSelectContainer}>
                예약오픈 알림
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
