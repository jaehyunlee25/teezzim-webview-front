import React, { useState, useEffect } from 'react';
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
  const [userInfo, setUserInfo] = useState([]);
  // console.log('🚀 - userInfo', userInfo);
  const [reserveData, setReserveData] = useState([]);
  // console.log('🚀 - reserveData', reserveData);
  const [reserveWait, setReserveWait] = useState([]);
  console.log('🚀 - reserveWait', reserveWait);
  const [reserveAlarm, setReserveAlarm] = useState([]);
  console.log('🚀 - reserveAlarm', reserveAlarm);

  const [deleteItem, setDeleteItem] = useState(false);

  const [isInitSignalSendApp, setIsInitSignal] = useState(false); // 나의예약 탭으로 이동했음을 App에 알렸는지 여부

  /** APP->WEB 브릿지 함수 선언 */
  useEffect(() => {
    if (isInitSignalSendApp == false) {
      console.log('한번만 수행될까?');
      if (window) {
        // window 존재여부 체크 (nextjs 특징)
        /** 로그인 APP->WEB 전송 */
        window.getSavedAuth = function (jsonStr) {
          setUserInfo(JSON.parse(jsonStr));
          // 데이터 샘플: [{"clubId":"골프장식별자","id":"아이디","password":"패스워드"}]
          const dataList = JSON.parse(jsonStr);
          // console.log(dataList);
          for (let i = 0; i < dataList.length; i++) {
            const data = dataList[i];
            handleGetReservationInfo(data.clubId, data.id, data.password);
            // TODO 배열일 경우에는??
          }
        };

        /** 예약 정보 APP->WEB 전송 */
        window.getSavedReservation = function (jsonStr) {
          const data = JSON.parse(jsonStr);
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
            window.BRIDGE.openWebMenu('Reservation');
          }, 100); // 약간 지연
        } else {
          setTimeout(() => {
            // 웹뷰에서는 테스트 데이터로!
            window.getSavedAuth(
              `[{"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","id":"newrison","password":"ilovegolf778"}]`,
            );
            window.getSavedWaitReservation(
              `[{"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","waitDate":"2022-05-12","waitTime":["05:22:00","05:29:00","05:22:00","16:13:00","05:22:00","05:29:00"]}]`,
            );
            window.getSavedOpenAlarm(
              `[{"clubId":"fccb4e5e-bf95-11ec-a93e-0242ac11000a","alarmDate":"2022-05-26"},{"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","alarmDate":"2022-05-26"}]`,
            );
          }, 1000);
        }
      }
      setIsInitSignal(true);
    }
  }, [isInitSignalSendApp]);

  const handleGetReservationInfo = function (club, id, password) {
    axios({
      method: 'POST',
      url: `/teezzim/teeapi/v1/club/${club}/reservation/confirm`,
      data: { id, password },
    })
      .then(({ data: respData }) => {
        for (let idx = 0; idx < respData.data.data.length; idx++) {
          respData.data.data[idx].golf_club = respData.data.golf_club;
        }
        setReserveData(respData.data);
        console.log(respData.data);
        if (window && window.BRIDGE && window.BRIDGE.saveReservationList) {
          // 앱으로 전송
          window.BRIDGE.saveReservationList(
            JSON.stringify({
              club,
              data: respData.data,
              golf_info: respData.golf_club,
            }),
          );
        }
      })
      .catch(err => {
        console.error(err);
        alert('통신중 문제가 발생하였습니다. 관리자에게 문의해주세요.');
      });
  };

  return (
    <>
      <div className={styles.topNav}>
        <button
          className={styles.sideBtn}
          onClick={() => window.location.reload()}
        >
          <Image src={IconImport} alt='Icon_Import' width={24} height={24} />
        </button>
        {/* <div className={styles.centerMenu}>
          <button>분류</button>
          <button>날짜</button>
          <button>골프장</button>
        </div> */}
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
        {reserveData?.data?.length > 0 ? (
          <>
            {reserveData?.data?.map((reserve, index) => (
              <ReserveTap
                key={index}
                index={index}
                userInfo={userInfo}
                reserve={reserve}
                reserveData={reserveData}
                deleteItem={deleteItem}
                handleClick={() => setConfirmHidden(false)}
              />
            ))}
          </>
        ) : (
          <>
            {reserveData?.data?.length === 0 ? (
              <p>예약 내역이 없습니다.</p>
            ) : (
              <div className='message-box loading-box'>
                <div className='loading-box'>
                  <div className='loading-icon'>
                    <span className='offscreen'>
                      데이터를 가져오고 있습니다.
                    </span>
                  </div>
                  <div className='loading-text ml-10'>
                    데이터를 가져오고 있습니다.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* <span>
              {`${reserve?.reserved_time} | ${reserve?.golf_club?.area} | ${reserve?.reserved_course} 코스`}
            </span> */}

      <div className={styles.reserveState}>
        <p>예약 대기</p>
      </div>
      <div className={styles.reserveContainer}>
        <ReserveWaitList reserveWait={reserveWait} />
      </div>

      <div className={styles.reserveState}>
        <p>예약오픈 알림</p>
      </div>
      <div className={styles.reserveContainer}>
        <ReserveAlarmList reserveAlarm={reserveAlarm} />
      </div>
      <BottomMenu />
    </>
  );
};

export default Reserve;

const ReserveWaitList = observer(({ reserveWait }) => {
  const { panelStore } = useStores();

  return reserveWait?.length > 0 ? (
    reserveWait.map(({ clubId, waitDate, waitTime }, idx) => {
      return (
        <React.Fragment key={`${clubId}-wait-${idx}`}>
          <p>{`${panelStore.teeListMap?.[clubId]?.name} | ${waitDate}`}</p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {waitTime?.map((item, index) => (
              <p style={{ marginTop: '0' }} key={index}>
                {item.slice(0, 5).replace('', ' | ')}
              </p>
            ))}
          </div>
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

const ReserveAlarmList = observer(({ reserveAlarm }) => {
  const { panelStore } = useStores();

  return reserveAlarm?.length > 0 ? (
    reserveAlarm.map(({ clubId, alarmDate }, idx) => (
      <p
        key={`${clubId}-alarm-${idx}`}
      >{`${panelStore?.teeListMap?.[clubId]?.name} | ${alarmDate}`}</p>
    ))
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
