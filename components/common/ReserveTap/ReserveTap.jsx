import Image from 'next/image';

import Arrow from '/assets/images/arrow.svg';
import Time from '/assets/images/Icon_time.svg';
import Bell from '/assets/images/Icon_bell.svg';
import Trash from '/assets/images/Icon_trash.svg';

import styles from './ReserveTap.module.scss';

const ReserveTap = ({ deleteItem }) => {
  return (
    <>
      <div className={styles.reserveTapContainer}>
        <div className={styles.dateInfo}>
          <div className={styles.alert}>
            <span>D-7</span>
            {/* <Image
              className={styles.time}
              src={Time}
              alt='time'
              width={26}
              height={26}
            /> */}
            <Image
              className={styles.bell}
              src={Bell}
              alt='bell'
              width={26}
              height={26}
            />
          </div>
          <div>
            <span>4월 4일(월요일)</span>
            <span>06:30 | 남춘천 | East코스</span>
          </div>
        </div>

        {deleteItem ? (
          <div className={styles.trash}>
            <Image src={Trash} alt='arrow' width={25} height={25} />
          </div>
        ) : (
          <Image src={Arrow} alt='arrow' width={5} height={26} />
        )}
      </div>
    </>
  );
};

export default ReserveTap;
