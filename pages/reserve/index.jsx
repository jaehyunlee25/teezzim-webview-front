import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Image from 'next/image';

import ReserveTap from '@/components/common/ReserveTap/ReserveTap';
import BottomMenu from '@/components/layouts/BottomMenu';

import IconImport from '/assets/images/Icon_Import.svg';

import styles from '@/styles/Reserve.module.scss';
import axios from 'axios';

const Reserve = () => {
  const [isInitSignalSendApp, setIsInitSignal] = useState(false); // 이 메뉴(나의예약) 탭으로 이동했음을 App에 알렸는지 여부
  const [reservationList, setReservationList] = useState([]);

  /** APP->WEB 브릿지 함수 선언 */
  useEffect(()=>{
    if(isInitSignalSendApp==false){
      console.log("한번만 수행될까?");
      if (window) { // window 존재여부 체크 (nextjs 특징)
        /** 로그인 APP->WEB 전송 */
        window.getLoginData = function(jsonStr){
          // example = {"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","id":"newrison","password":"ilovegolf778"}
          const data = JSON.parse(jsonStr);
          console.log(data);
          handleGetReservationInfo(data.clubId, data.id, data.password);
        }
        /** 예약 정보 APP->WEB 전송 */
        window.getAppData = function(jsonStr) {
          const data = JSON.parse(jsonStr);
          console.log(data);
          // TODO 예약 확정 메뉴에 띄움?
        };
      }
      
      if (window && window.BRIDGE && window.BRIDGE.openWebMenu) {
        setTimeout(()=>{
          /** 나의 예약 탭 열림 여부 WEB->APP 전송 */
          window.BRIDGE.openWebMenu("MyReservation");
        }, 300); // 약간 지연
      }
      setIsInitSignal(true);
    }
  }, []);

  const handleGetReservationInfo = function(club, id, password){
    axios({
      method: 'POST',
      url: `/teezzim/teeapi/v1/club/${club}/reservation/confirm`,
      data: { id, password }
    }).then( ({data:respData }) => {
      console.log(respData);
      setReservationList(respData.data); // TODO UI 처리
      if (window && window.BRIDGE && window.BRIDGE.setReservationInfo) { // 앱으로 전송
        window.BRIDGE.setReservationInfo( JSON.stringify( {club, data: respData.data} ) );
      }
    }).catch( err => {
      console.error(err);
      alert("통신중 문제가 발생하였습니다. 관리자에게 문의해주세요.");
    });
  }

  return (
    <>
      <div className={styles.topNav}>
        <button className={styles.sideBtn}>
          <Image src={IconImport} alt='Icon_Import' width={24} height={24} />
        </button>
        <div className={styles.centerMenu}>
          <button>분류</button>
          <button>날짜</button>
          <button>골프장</button>
        </div>
        <button className={styles.sideBtn}>편집</button>
      </div>

      <div className={styles.reserveState}>
        <p>예약 확정</p>
      </div>
      <div className={styles.reserveContainer}>
        <ReserveTap />
        <ReserveTap />
        <ReserveTap />
        <ReserveTap />
        <ReserveTap />
        <ReserveTap />
        <ReserveTap />
        <ReserveTap />
      </div>

      <div className={styles.reserveState}>
        <p>예약 대기</p>
      </div>
      <div className={styles.reserveContainer}>
        <ReserveTap />
        <ReserveTap />
        <ReserveTap />
        <ReserveTap />
        <ReserveTap />
      </div>

      <div className={styles.reserveState}>
        <p>예약오픈 알림</p>
      </div>
      <div className={styles.reserveContainer}>
        <ReserveTap />
        <ReserveTap />
        <ReserveTap />
        <ReserveTap />
        <ReserveTap />
      </div>

      {/* <Toast message='골프장을 1개 이상 선택해 주세요.' /> */}
      <BottomMenu />
    </>
  );
};

export default Reserve;
