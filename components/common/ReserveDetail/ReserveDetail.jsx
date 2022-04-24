import styles from './ReserveDetail.module.scss';

const ReserveDetail = ({ detail }) => {
  return (
    <>
      <div className={styles.reserveDetailContainer}>
        <div className={styles.reserveInfo}>
          <span>라운드 예약일자</span>
          <span>{detail?.reserved_date}</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.reserveInfo}>
          <span>시간</span>
          <span>{detail?.reserved_time}</span>
        </div>

        <div className={styles.reserveInfo}>
          <span>코스명</span>
          <span>{detail?.reserved_course} 코스</span>
        </div>

        <div className={styles.reserveInfo}>
          <span>홀정보</span>
          <span>18홀</span>
        </div>

        <div className={styles.reserveInfo}>
          <span>그린피</span>
          <span>230,000원</span>
        </div>
      </div>
    </>
  );
};

export default ReserveDetail;
