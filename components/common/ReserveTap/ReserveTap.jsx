import { useRouter } from 'next/router';
import Image from 'next/image';

import Arrow from '/assets/images/arrow.svg';
import Time from '/assets/images/Icon_time.svg';
import Bell from '/assets/images/Icon_bell.svg';
import Trash from '/assets/images/Icon_trash.svg';

import styles from './ReserveTap.module.scss';

const ReserveTap = ({ reserve, deleteItem }) => {
  const router = useRouter();

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
            <span>{reserve?.reserved_date}</span>
            <span>
              {`${reserve?.reserved_time} | ${reserve?.golf_club?.area} | ${reserve?.reserved_course}   코스`}
            </span>
          </div>
        </div>

        {deleteItem ? (
          <div className={styles.trash}>
            <Image src={Trash} alt='arrow' width={25} height={25} />
          </div>
        ) : (
          <Image
            src={Arrow}
            alt='arrow'
            width={5}
            height={26}
            onClick={() => router.push(`/reserve/${reserve?.golf_club?.id}`)}
          />
        )}
      </div>
    </>
  );
};

export default ReserveTap;
