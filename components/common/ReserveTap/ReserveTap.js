import Image from 'next/image';

import Arrow from '/assets/images/arrow.svg';

import styles from './ReserveTap.module.scss';

const ReserveTap = () => {
  return (
    <>
      <div className={styles.reserveTapContainer}>
        <span>D-7</span>
        <div className={styles.dateInfo}>
          <span>4월 4일(월요일)</span>
          <span>06:30 | 남춘천 | East코스</span>
        </div>

        <Image src={Arrow} alt='arrow' width={5} height={26} />
      </div>
    </>
  );
};

export default ReserveTap;
