import styles from './ReserveDetail.module.scss';

const ReserveDetail = ({ detail }) => {
  console.log('🚀 - detail', detail);
  return (
    <>
      <div className={styles.reserveDetailContainer}>
        <div className={styles.reserveInfo}>
          <span>라운드 예약일자</span>
          <span>{detail && detail[0]?.game_date}</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.reserveInfo}>
          <span>시간</span>
          <span>{detail && detail[0]?.game_time}</span>
        </div>

        <div className={styles.reserveInfo}>
          <span>코스명</span>
          <span>{detail && `${detail[0]?.GolfCourse?.name} 코스`}</span>
        </div>

        <div className={styles.reserveInfo}>
          <span>홀정보</span>
          <span>{detail && detail[0]?.GolfCourse?.description}</span>
        </div>

        {/* <div className={styles.reserveInfo}>
          <span>그린피</span>
          <span>
            {detail && `${(detail[0]?.fee_normal).toLocaleString()}원`}
          </span>
        </div> */}
      </div>
    </>
  );
};

export default ReserveDetail;
