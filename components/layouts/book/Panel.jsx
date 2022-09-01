import Link from 'next/link';
import NavTab from '@/components/book/Panel/NavTab';
import SearchContainer from '@/components/book/Panel/SearchContainer';
import TeeListArea from '@/components/book/Panel/TeeListArea';

import useStores from '@/stores/useStores';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Counter from '@/components/book/Panel/Counter';
import { observer } from 'mobx-react-lite';
import PopUp from '@/components/common/PopUp';

const Panel = observer(() => {
  const router = useRouter();
  const { ...others } = router?.query;
  const { panelStore, authStore, toastStore, teeScheduleStore } = useStores();
  const [isHidePopup, setIsHidePopup] = useState(true);
  const [isWarnPopup, setIsWarnPopup] = useState(true);
  const [warnState, setWarnState] = useState(1);

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

  const handleWarnPopup = (state) => {
    if(state === 1) {
      setWarnState(state);
      setIsWarnPopup(false);
    }
    if(state === 2) {
      setWarnState(state);
      setIsWarnPopup(false);
    }
  }
  useEffect(() => {
    mountRef.current = true;
    getTeeList().then(()=>{
      const localCheckList = localStorage.getItem('checkList');
      if(localCheckList){
        JSON.parse(localCheckList).forEach(tee => panelStore.addChecked(JSON.stringify(panelStore.teeListMap?.[tee.club_id])));
      }
    });
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
      // window 존재여부 체크 (nextjs 특징)
      if (window) {
        /** 로그인 APP->WEB 전송 */
        window.getSavedAuth = function (jsonStr) {
          console.log(jsonStr);
          // 데이터 샘플: [{"clubId":"골프장식별자","id":"아이디","password":"패스워드"}]
          const dataList = JSON.parse(jsonStr);
          if(dataList.length===0 && isInitSignalSendApp && authStore.communicated)setIsHidePopup(false);
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
        } else if (window.webkit && window.webkit.messageHandlers) {
          window.webkit.messageHandlers.openWebMenu.postMessage('Reservation');
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
  }, [isInitSignalSendApp, panelStore, authStore, authStore.communicated]);

  const handleSelectContainer = e => {
    const selectedLength = panelStore.checkedTeeList.size;
    const { id } = e.target;
    if (!id) return;
    if (id !== 'book' && id !== 'wait' && id !== 'alarm') return;

    teeScheduleStore.setDate(0);
    if (id === 'wait' || id === 'alarm' ) { // 준비중 팝업 호출
      const params = { command: 'showPopupWait', data: ''};
      // if (window.BRIDGE && window.BRIDGE.globalMethod) {
      //   window.BRIDGE.globalMethod(JSON.stringify(params));
      // } else if (window.webkit && window.webkit.messageHandlers ) {
      //   window.webkit.messageHandlers.globalMethod.postMessage(JSON.stringify(params));
      // }
      // return;
    }

    if (selectedLength <= 0) {
      toastStore.setMessage('골프장을 1개 이상 선택해 주세요.');
      toastStore.setHidden(false);
      return;
    }

    if (selectedLength > 20) {
      const obj = id === 'wait' ? '대기' : id === 'alarm' ? '오픈알림' : '';
      toastStore.setMessage(
        <>
          20개 이하의 골프장에서만
          <br /> 예약{obj}을 할 수 있습니다.
        </>,
      );
      toastStore.setHidden(false);
      return;
    }

    if (id === 'book'){
      teeScheduleStore.setCalenderUpdate();
      // const ctl = Array.from(panelStore.checkedTeeList);
      let data = [];
      for (const item of panelStore.checkedTeeList) {
        const ctl = JSON.parse(item);
        if (ctl.state !== 1 || ctl.state !== 2){
          data.push({ club: ctl.eng, club_id: ctl.id });
          const timeKey = 'search-' + ctl.id;
          const nowTime = (new Date()).getTime();
          window.localStorage.setItem(timeKey, nowTime);
        }
      }
      if (window.BRIDGE && window.BRIDGE.requestSearch) {
        window.BRIDGE.requestSearch(JSON.stringify(data));
      } else if (window.webkit && window.webkit.messageHandlers ) {
        const payload = JSON.stringify({
          command: 'requestSearch',
          data: JSON.stringify(data)
        });
        window.webkit.messageHandlers.globalMethod.postMessage(payload);
      } else {
        console.warn('이 기능은 앱에서만 동작합니다.' + JSON.stringify(data));
      }
    }
    localStorage.setItem('checkList', JSON.stringify(data));
    window.teeSearchFinished = function () {
      router.push({
        href: '/home',
        query: {
          ...others,
          subTab: 'tabContent01',
          container: id,
          prev: 'home',
        },
      });
      panelStore.setPanelHidden(true);
    }
  };

useEffect(()=>{

  if(window){
    window.addEventListener('popstate', function(event) { 
      const storage = globalThis?.sessionStorage;
      if(!storage) return;

      const currentPath =storage.getItem('currentPath');

      if(currentPath === '/teezzim/home')
      panelStore.setPanelHidden(false);
    });
  }
});

  return (
    <>
      <div hidden={panelStore.panelHidden}>
      <PopUp
        reverse={true}
        smallClose={true}
        hidden={isHidePopup}
        buttonText='등록하러가기'
        onButtonClick={e => {
          setIsHidePopup(true);
        }}
        cancelButtonClick={e => {
          setIsHidePopup(true);
        }}
      >
        <div className='golf-club mt-25' />
        <div className='notice-popup mb-20'>
          <strong>
            골프장 예약사이트의<br />
            계정정보들을 등록하세요.<br />
            <span className='text-primary'>예약에 필요한 정보를</span><br />
            <span className='text-primary'>모아서 보실수 있습니다.</span>
          </strong>
        </div>
      </PopUp>
      <PopUp
        reverse={true}
        hidden={isWarnPopup}
        buttonText='확인'
        isCancel={true}
        wi
        onButtonClick={e => {
          setIsWarnPopup(true);
        }}
        cancelButtonClick={e => {
          setIsWarnPopup(true);
        }}
      >
        <div className='warn-icon' />
        <div className='warn-popup'>
          {
            warnState === 1 && 
          <strong>
          <span className='text-surface2'>시스템 오류</span>
            <p className='mb-5 mt-5'>시스템에 장애가 생겼습니다.</p>
            복구중이니 잠시 기다려 주세요..<br />
          </strong>
          }
          {
            warnState === 2 &&
              <strong>
                <span className='text-surface2'>골프장 오류</span>
                <p className='mb-5 mt-5'>해당 클럽의 홈페이지에 일시적인 접속장애가 있습니다.</p>
                잠시후에 다시 시도 해보세요.<br />
              </strong>
          }
        </div>
      </PopUp>
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
                    </div>
                    <TeeListArea
                      handleWarnPopup={handleWarnPopup}
                      registered
                      list={panelStore.registeredTeeList.sort((a, b) =>
                        a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
                      )}
                    />
                  </>
                )}

                {!panelStore.filter &&
                panelStore.unregisteredTeeList.length <= 0 ? null : (
                  <>
                    <div className='list_AreaTop'>
                      <Counter type='unregistered' />
                      {/* <span className="fr">전체선택</span> */}
                    </div>
                    <TeeListArea
                      handleWarnPopup={handleWarnPopup}
                      list={panelStore.unregisteredTeeList.sort((a, b) =>
                        a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
                      )}
                    />
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
              <li className='button'>티찜</li>
              <li className='button'>티찜</li>
              {/* <li id='wait' className='button' onClick={handleSelectContainer}>
                예약대기
              </li>
              <li id='alarm' className='button' onClick={handleSelectContainer}>
                예약오픈 알림
              </li> */}
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
