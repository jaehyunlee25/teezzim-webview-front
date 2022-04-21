import { useEffect } from 'react';
import useSWR from 'swr';
import Image from 'next/image';

import ReserveTap from '@/components/common/ReserveTap/ReserveTap';
import BottomMenu from '@/components/layouts/BottomMenu';

import IconImport from '/assets/images/Icon_Import.svg';

import styles from '../../styles/Reserve.module.scss';

const Reserve = () => {
  const { data } = useSWR(`/teezzim/teeapi/v1/schedule`);

  console.log('🚀 - data', data);

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
