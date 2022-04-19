import Image from 'next/image';

import ReserveTap from '@/components/common/ReserveTap/ReserveTap';
import BottomMenu from '@/components/layouts/BottomMenu.js';

import Back from '/assets/images/Icon_Back.svg';

import styles from '../../styles/Reserve.module.scss';

const Reserve = () => {
  return (
    <>
      <div className={styles.topNav}>
        <Image src={Back} alt='Back' width={24} height={24} />

        <div className={styles.centerMenu}>
          <h4>예약정보</h4>
        </div>
      </div>

      <div className={styles.reserveTitle}>
        <p>스카이 72</p>
        <button className={styles.sideBtn} style={{ width: '90px' }}>
          골프장 정보
        </button>
      </div>
      <div className={styles.reserveContainer}>
        <ReserveTap />
      </div>

      {/* <Toast message='골프장을 1개 이상 선택해 주세요.' /> */}
      <BottomMenu />
    </>
  );
};

export default Reserve;
