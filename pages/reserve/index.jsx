import React, { useState, useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import axios from 'axios';

import { useMutation } from '@/lib/hooks/useMutation';
import ReserveTap from '@/components/common/ReserveTap/ReserveTap';
import PopUp from '@/components/common/PopUp';
import BottomMenu from '@/components/layouts/BottomMenu';

import IconImport from '/assets/images/Icon_Import.svg';

import styles from '../../styles/Reserve.module.scss';
import { observer } from 'mobx-react-lite';
import useStores from '@/stores/useStores';

const Reserve = () => {
  const { panelStore, authStore } = useStores();
  const [userInfo, setUserInfo] = useState([]);
  // console.log('🚀 - userInfo', userInfo);
  const [reserveData, setReserveData] = useState([]);
  // console.log('🚀 - reserveData', reserveData);
  const [reserveWait, setReserveWait] = useState([]);
  // console.log('🚀 - reserveWait', reserveWait);
  const [reserveAlarm, setReserveAlarm] = useState([]);
  // console.log('🚀 - reserveAlarm', reserveAlarm);

  const [test, setTest] = useState({
    resultCode: 1,
    message: 'OK',
    data: [
      /*
      {
        id: '09982dcb-0ab4-11ed-a93e-0242ac11000a',
        device_id: '95b7a543-ea1d-11ec-a93e-0242ac11000a',
        golf_club_id: '1b01f7dc-ee3b-11ec-a93e-0242ac11000a',
        golf_course_id: '1b0590d0-ee3b-11ec-a93e-0242ac11000a',
        game_date: '20220819',
        game_time: '0616',
        isCancel: 0,
        created_at: '2022-07-23T18:20:08.000Z',
        updated_at: '2022-07-23T18:20:08.000Z',
        createdAt: '2022-07-23T18:20:08.000Z',
        updatedAt: '2022-07-23T18:20:08.000Z',
        Device: {
          id: '95b7a543-ea1d-11ec-a93e-0242ac11000a',
          token:
            'dojdZqaQRR-Xf-7sl05bY6:APA91bGNoMmJZZTERSqD311_6GTtAZoZH2ZTStXbrEZ6vCMTa50dkcD0xf64LfbOJHgtjtGeUcnI_VwgexrNbLY0bB30AbtW9jlImnkQDRF2jFyXqewSvQJ_yCFP22OcwUGa9MUCYRIp',
          type: 'admin',
          created_at: '2022-06-12T07:02:23.000Z',
          updated_at: '2022-06-12T07:02:23.000Z',
        },
        GolfClub: {
          id: '1b01f7dc-ee3b-11ec-a93e-0242ac11000a',
          name: '클럽모우',
          address: '강원도 홍천군 서면 장락동길 111',
          phone: '033-439-9000',
          area: '강원도',
          email: '',
          homepage: 'http://www.clubmow.com/_mobile/index.asp',
          corp_reg_number: '227-86-01869',
          description: '3년연속소비자만족10대골프장',
        },
        GolfCourse: {
          id: '1b0590d0-ee3b-11ec-a93e-0242ac11000a',
          golf_club_id: '1b01f7dc-ee3b-11ec-a93e-0242ac11000a',
          name: '마운틴',
          description: '9홀',
          createdAt: '2022-06-17T12:43:48.000Z',
          updatedAt: '2022-06-17T12:43:48.000Z',
          GolfClubId: '1b01f7dc-ee3b-11ec-a93e-0242ac11000a',
        },
      },
      {
        id: '67614a41-0abb-11ed-a93e-0242ac11000a',
        device_id: '95b7a543-ea1d-11ec-a93e-0242ac11000a',
        golf_club_id: 'c0bb80e9-ef21-11ec-a93e-0242ac11000a',
        golf_course_id: 'c0c0a4c8-ef21-11ec-a93e-0242ac11000a',
        game_date: '20220813',
        game_time: '1740',
        isCancel: 0,
        created_at: '2022-07-23T19:12:52.000Z',
        updated_at: '2022-07-23T19:12:52.000Z',
        createdAt: '2022-07-23T19:12:52.000Z',
        updatedAt: '2022-07-23T19:12:52.000Z',
        Device: {
          id: '95b7a543-ea1d-11ec-a93e-0242ac11000a',
          token:
            'dojdZqaQRR-Xf-7sl05bY6:APA91bGNoMmJZZTERSqD311_6GTtAZoZH2ZTStXbrEZ6vCMTa50dkcD0xf64LfbOJHgtjtGeUcnI_VwgexrNbLY0bB30AbtW9jlImnkQDRF2jFyXqewSvQJ_yCFP22OcwUGa9MUCYRIp',
          type: 'admin',
          created_at: '2022-06-12T07:02:23.000Z',
          updated_at: '2022-06-12T07:02:23.000Z',
        },
        GolfClub: {
          id: 'c0bb80e9-ef21-11ec-a93e-0242ac11000a',
          name: '큐로',
          address: '경기도 광주시 곤지암읍 오향길 180',
          phone: '031-799-6000',
          area: '수도권',
          email: '',
          homepage: 'http://www.curocc.com/mobile/index.asp',
          corp_reg_number: '107-86-92969',
          description:
            '큐로컨트리클럽을 찾아주신 고객 여러분 감사드립니다.\n\n큐로컨트리클럽은 경기도 광주 곤지암에 위치한 30년 전통의 27홀 ‘Prestige Public(프레스티지 퍼블릭)’ 골프장입니다.\n서울에서 40분 거리의 뛰어난 접근성과, 해발 460미터의 산자락에 무성하게 펼쳐진 자연림에 살포시 자리한 27홀 골프코스는 매 홀 독특한 개성으로 마치 수목원에 와있는 듯한 경험을 제공하고 있습니다.\n\n큐로컨트리클럽은 ‘Prestige Public(프레스티지 퍼블릭)’이라는 확고한 운영방침에 따라 코스 및 시설 개선을 위해 신속하고도 과감한 투자를 진행하고 있으며, 동시에 최고의 서비스를 제공할 수 있도록 임직원, 캐디, 파트너사 구성원들의 서비스역량 향상을 위한 교육, 근무환경 및 복지의 향상에도 아낌없는 노력을 기울이고 있습니다.\n\n감사합니다.',
        },
        GolfCourse: {
          id: 'c0c0a4c8-ef21-11ec-a93e-0242ac11000a',
          golf_club_id: 'c0bb80e9-ef21-11ec-a93e-0242ac11000a',
          name: '파인힐',
          description: '9홀',
          createdAt: '2022-06-18T16:14:51.000Z',
          updatedAt: '2022-06-18T16:14:51.000Z',
          GolfClubId: 'c0bb80e9-ef21-11ec-a93e-0242ac11000a',
        },
      }, */
    ],
  });
  console.log('🚀 - test', test.data);

  const [sortData, setSortData] = useState('분류');

  /** Tee 정보 가져오는 API 호출 */
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
  /**  */

  const [deleteItem, setDeleteItem] = useState(false);

  const [isInitSignalSendApp, setIsInitSignal] = useState(false); // 나의예약 탭으로 이동했음을 App에 알렸는지 여부

  /** APP->WEB 브릿지 함수 선언 */
  useEffect(() => {
    if (isInitSignalSendApp == false) {
      console.log('한번만 수행될까?');
      if (window) {
        // window 존재여부 체크 (nextjs 특징)
        /** 크롤링 완료 신호 APP->WEB 전송 */
        window.getMyReserveForApi = function (jsonStr) {
          console.log('getMyReserveForApi', jsonStr); // device_id 필요
          const { device_id } = JSON.parse(jsonStr);
          authStore.setDeviceId(device_id);
          axios({
            method: 'post',
            url: `/teezzim/teeapi/v1/club/reservation`,
            data: { device_id },
          })
            .then(resp => {
              //console.log("###", resp.data);
              setTest(resp.data);
              // TODO 새로운 데이터 형식으로 뿌려줘야 함!
              /* 샘플 데이터 구조
            {
              "resultCode": 1,
              "message": "OK",
              "data": [{
                  "id": "165ec3da-0ab7-11ed-a93e-0242ac11000a",
                  "device_id": "9b2d40ad-0aa3-11ed-a93e-0242ac11000a",
                  "golf_club_id": "28fd237b-eeca-11ec-a93e-0242ac11000a",
                  "golf_course_id": "28ff717a-eeca-11ec-a93e-0242ac11000a",
                  "game_date": "20220809",
                  "game_time": "1234",
                  "isCancel": 1,
                  "created_at": "2022-07-23T18:41:58.000Z",
                  "updated_at": "2022-07-23T18:41:58.000Z",
                  "createdAt": "2022-07-23T18:41:58.000Z",
                  "updatedAt": "2022-07-23T18:41:58.000Z",
                  "Device": {
                      "id": "9b2d40ad-0aa3-11ed-a93e-0242ac11000a",
                      "token": "fEGot2k1Sh2raE28s2pBoY:APA91bHDIdB-cBkyiYXC-4Ckyn5ZhZHVyHfLJ9V1Lewm9HieEKx78JoYmQF-VzPseqy1edlYc20cbYjosWYJ6zrV4qMNETSXAMYowPwAkSpaVDzBgWiwbJYso28qPSU1H08LgCN3Dymz",
                      "type": "android",
                      "created_at": "2022-07-23T16:22:31.000Z",
                      "updated_at": "2022-07-23T16:22:31.000Z"
                  },
                  "GolfClub": {
                      "id": "28fd237b-eeca-11ec-a93e-0242ac11000a",
                      "name": "백제",
                      "address": "충청남도 부여군 은산면 충절로 3734-82",
                      "phone": "041-830-0700",
                      "area": "충청도",
                      "email": "baekjecc0700@naver.com",
                      "homepage": "https://www.baekjecc.com/index.asp",
                      "corp_reg_number": "307-81-06923",
                      "description": "백제컨트리클럽은 칠갑산 자락에 감싸 안겨 천혜의 지형 조건과 자연 상태를 코스에 담아내기 위해 친환경적인 시공 방법으로 골프장을 조성하였고, 2008년 개장한 이후 끊임없는 변화를 추구하며 항상 새로운 모습을 보여드리기 위해 노력해왔습니다.\n\n또한, 친환경적인 골프장으로서 현재 금강유역환경청, 고운식물원과 협약하여 천연기념물과 멸종위기 종인 동, 식물의 복원사업을 추진 중입니다.\n\n2008년 대중제 331ㅎ 규모로 개장 하였고 8년간 정성을 다해 준비하여 2016년 10월 11일 한성코스 9홀을 추가로 오픈하여 규모 27홀의 대중제 골프장으로 새롭게 단장하였습니다.\n\n백제컨트리클럽은 모두가 즐길 수 있는 코스 레이아웃과 풍광이 주는 감동, 삼림욕을 즐기는 듯한 청량감에 좋은 사람과 편안한 휴식을 하시기에 최적의 골프장이라 자신합니다.\n\n최고의 골프장으로 발돋움 할 수 있도록 끊임없이 배우고 받아들이고 노력하겠습니다.\n\n백제 컨트리클럽을 방문하여 주셔서 감사합니다."
                  },
                  "GolfCourse": {
                      "id": "28ff717a-eeca-11ec-a93e-0242ac11000a",
                      "golf_club_id": "28fd237b-eeca-11ec-a93e-0242ac11000a",
                      "name": "웅진",
                      "description": "9홀",
                      "createdAt": "2022-06-18T05:47:50.000Z",
                      "updatedAt": "2022-06-18T05:47:50.000Z",
                      "GolfClubId": "28fd237b-eeca-11ec-a93e-0242ac11000a"
                  }
                },
              ],
            }
            */
            })
            .catch(err => {
              console.log(err);
            });
        };
        /** 로그인 APP->WEB 전송 */
        window.getSavedAuth = function (jsonStr) {
          setUserInfo(JSON.parse(jsonStr));

          // 데이터 샘플: [{"clubId":"골프장식별자","id":"아이디","password":"패스워드"}]
          const dataList = JSON.parse(jsonStr);
          panelStore.setRegisteredKeys(dataList.map(({ clubId }) => clubId));
          // console.log(dataList);

          for (let i = 0; i < dataList.length; i++) {
            const findIndex = panelStore.teeList.findIndex(
              item => item.id == dataList[i].clubId,
            );
            if (findIndex > -1) {
              dataList[i].clubInfo = panelStore.teeList[findIndex];
            }

            // const data = dataList[i];
            // const pw = data.password || data.pw; // undefined 방지
            // handleGetReservationInfo(data.clubId, data.id, pw);
            // TODO 배열일 경우에는??
            const data = {
              club: dataList[i].clubInfo.eng,
              club_id: dataList[i].clubInfo.id,
            };
            console.log(data);
            // if (window.BRIDGE && window.BRIDGE.requestSearchReserve) {
            //   window.BRIDGE.requestSearchReserve(JSON.stringify(data));
            // } else if (window.webkit && window.webkit.messageHandlers) {
            //   window.webkit.messageHandlers.requestSearchReserve.postMessage(
            //     JSON.stringify(data),
            //   );
            // } else {
            //   console.warn(
            //     '이 기능은 앱에서만 동작합니다.' + JSON.stringify(data),
            //   );
            // }
          }
        };
        /** 예약 정보 APP->WEB 전송 */
        window.getSavedReservation = function (jsonStr) {
          const data = JSON.parse(jsonStr);
          console.log(data);
          setReserveData(data);
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
          console.log(data);
          setReserveWait(data);
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
          console.log(data);
          setReserveAlarm(data);
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

        if (window.BRIDGE && window.BRIDGE.openWebMenu) {
          setTimeout(() => {
            window.BRIDGE.openWebMenu('MyReservation');
          }, 100); // 약간 지연
        } else if (window.webkit && window.webkit.messageHandlers) {
          setTimeout(() => {
            window.webkit.messageHandlers.openWebMenu.postMessage(
              'MyReservation',
            );
          }, 100);
        } else {
          setTimeout(() => {
            // 웹뷰에서는 테스트 데이터로!
            window.getSavedAuth(
              `[{"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","id":"newrison","password":"ilovegolf778"}]`,
            );
            // window.getSavedReservation(
            //   `[{"clubId:"6cbc1160-79af-11ec-b15c-0242ac110005", "reserved_date": "2022.05.09", "reserved_time": "05:25", "reserved_course": "SOUTH"}]`,
            // );
            window.getSavedWaitReservation(
              `[{"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","waitDate":"2022-05-12","waitTime":["05:22:00","05:29:00","05:22:00","16:13:00","05:22:00","05:29:00","05:30:00","05:31:00"]}]`,
            );
            window.getSavedOpenAlarm(
              `[{"clubId":"fccb4e5e-bf95-11ec-a93e-0242ac11000a","alarmDate":"2022-05-30"},{"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","alarmDate":"2022-06-05"}]`,
            );
          }, 1000);
        }
      }
      setIsInitSignal(true);
    }
  }, [isInitSignalSendApp, panelStore]);

  // const handleGetReservationInfo = function (club, id, password) {
  //   axios({
  //     method: 'POST',
  //     url: `/teezzim/teeapi/v1/club/${club}/reservation/confirm`,
  //     data: { id, password },
  //   })
  //     .then(({ data: respData }) => {
  //       for (let idx = 0; idx < respData.data.data.length; idx++) {
  //         respData.data.data[idx].golf_club = respData.data.golf_club;
  //       }
  //       setReserveData(respData.data);
  //       console.log(respData.data);
  //       if (window) {
  //         const jsonStr = JSON.stringify({
  //           club,
  //           data: respData.data,
  //           golf_info: respData.golf_club,
  //         });
  //         // 앱으로 전송
  //         if (window.BRIDGE && window.BRIDGE.saveReservationList) {
  //           window.BRIDGE.saveReservationList(jsonStr);
  //         } else if (window.webkit && window.webkit.messageHandlers) {
  //           window.webkit.messageHandlers.saveReservationList.postMessage(
  //             jsonStr,
  //           );
  //         }
  //       }
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       alert('통신중 문제가 발생하였습니다. 관리자에게 문의해주세요.');
  //     });
  // };

  return (
    <>
      <div className={styles.topNav}>
        <button
          className={styles.sideBtn}
          onClick={() => window.location.reload()}
        >
          <Image src={IconImport} alt='Icon_Import' width={24} height={24} />
        </button>
        <div className={styles.centerMenu}>
          <button
            onClick={() => setSortData('분류')}
            style={sortData === '분류' ? { backgroundColor: '#115B40' } : null}
          >
            분류
          </button>
          <button
            onClick={() => setSortData('날짜')}
            style={sortData === '날짜' ? { backgroundColor: '#115B40' } : null}
          >
            날짜
          </button>
          <button
            onClick={() => setSortData('골프장')}
            style={
              sortData === '골프장' ? { backgroundColor: '#115B40' } : null
            }
          >
            골프장
          </button>
        </div>
        <button
          className={styles.sideBtn}
          onClick={() => setDeleteItem(!deleteItem)}
        >
          {deleteItem ? '완료' : '편집'}
        </button>
      </div>

      <div className={styles.reserveState}>
        <p>예약 확정</p>
      </div>
      <div className={styles.reserveContainer}>
        {test?.data?.map((reserve, index) => {
          const year = reserve?.game_date?.substring(0, 4);
          const month = reserve?.game_date?.substring(4, 6);
          const day = reserve?.game_date?.substring(6, 8);
          let today = new Date();
          let dDay = new Date(year, month - 1, day);
          let gap = dDay.getTime() - today.getTime();
          let dDayResult = Math.ceil(gap / (1000 * 60 * 60 * 24));

          console.log("###1", reserve);

          return (
            <ReserveTap
              key={index}
              index={index}
              type='reserve'
              userInfo={userInfo}
              reserve={reserve}
              reserveData={reserveData}
              deleteItem={deleteItem}
              dDay={dDayResult}
              handleClick={() => setConfirmHidden(false)}
            />
          );
        })}
      </div>

      <div className={styles.reserveState}>
        <p>예약 대기</p>
      </div>
      <div className={styles.reserveContainer}>
        <ReserveWaitList reserveWait={reserveWait} deleteItem={deleteItem} />
      </div>

      <div className={styles.reserveState}>
        <p>예약오픈 알림</p>
      </div>
      <div className={styles.reserveContainer}>
        <ReserveAlarmList reserveAlarm={reserveAlarm} deleteItem={deleteItem} />
      </div>
      <BottomMenu />
    </>
  );
};

export default Reserve;

const ReserveWaitList = observer(({ reserveWait, deleteItem }) => {
  const { panelStore } = useStores();

  return reserveWait?.length > 0 ? (
    reserveWait.map(({ clubId, waitDate, waitTime }, index) => {
      const year = waitDate?.split('-')[0];
      const month = waitDate?.split('-')[1];
      const day = waitDate?.split('-')[2];
      let today = new Date();
      let dDay = new Date(year, month - 1, day);
      let gap = dDay.getTime() - today.getTime();
      let dDayResult = Math.ceil(gap / (1000 * 60 * 60 * 24));

      return (
        <React.Fragment key={`${clubId}-wait-${index}`}>
          {dDayResult > 0 ? null : (
            <ReserveTap
              key={index}
              index={index}
              type='wait'
              clubName={panelStore.teeListMap?.[clubId]?.name}
              waitDate={waitDate}
              waitTime={waitTime}
              dDay={dDayResult}
              deleteItem={deleteItem}
              handleClick={() => setConfirmHidden(false)}
            />
          )}
        </React.Fragment>
      );
    })
  ) : (
    <>
      {reserveWait?.length === 0 ? (
        <p>예약 대기가 없습니다.</p>
      ) : (
        <div className='message-box loading-box'>
          <div className='loading-box'>
            <div className='loading-icon'>
              <span className='offscreen'>데이터를 가져오고 있습니다.</span>
            </div>
            <div className='loading-text ml-10'>
              데이터를 가져오고 있습니다.
            </div>
          </div>
        </div>
      )}
    </>
  );
});

const ReserveAlarmList = observer(({ reserveAlarm, deleteItem }) => {
  const { panelStore } = useStores();

  return reserveAlarm?.length > 0 ? (
    reserveAlarm.map(({ clubId, alarmDate }, index) => {
      const year = alarmDate?.split('-')[0];
      const month = alarmDate?.split('-')[1];
      const day = alarmDate?.split('-')[2];
      let today = new Date();
      let dDay = new Date(year, month - 1, day);
      let gap = dDay.getTime() - today.getTime();
      let dDayResult = Math.ceil(gap / (1000 * 60 * 60 * 24));

      return (
        <React.Fragment key={index}>
          {dDayResult > 0 ? null : (
            <ReserveTap
              key={index}
              index={index}
              type='alarm'
              clubName={panelStore?.teeListMap?.[clubId]?.name}
              alarmDate={alarmDate}
              dDay={dDayResult}
              deleteItem={deleteItem}
              handleClick={() => setConfirmHidden(false)}
            />
          )}
        </React.Fragment>
      );
    })
  ) : (
    <>
      {reserveAlarm?.length === 0 ? (
        <p>예약 오픈 알림이 없습니다.</p>
      ) : (
        <div className='message-box loading-box'>
          <div className='loading-box'>
            <div className='loading-icon'>
              <span className='offscreen'>데이터를 가져오고 있습니다.</span>
            </div>
            <div className='loading-text ml-10'>
              데이터를 가져오고 있습니다.
            </div>
          </div>
        </div>
      )}
    </>
  );
});
