import styles from './ReserveDetail.module.scss';

const ReserveDetail = ({ detail, idx }) => {
  console.log('🚀 - detail', detail);
  return (
    <>
      <div className={styles.reserveDetailContainer}>
        <div className={styles.reserveInfo}>
          <span>라운드 예약일자</span>
          <span>
            {detail &&
              `${detail[idx]?.game_date.substring(
                0,
                4,
              )}-${detail[idx]?.game_date.substring(
                4,
                6,
              )}-${detail[idx]?.game_date.substring(6, 8)}`}
          </span>
        </div>

        <div className={styles.divider} />

        <div className={styles.reserveInfo}>
          <span>시간</span>
          <span>
            {detail &&
              `${detail[idx]?.game_time.substring(
                0,
                2,
              )}:${detail[idx]?.game_time.substring(2, 4)}`}
          </span>
        </div>

        <div className={styles.reserveInfo}>
          <span>코스명</span>
          <span>{detail && `${detail[idx]?.GolfCourse?.name} 코스`}</span>
        </div>

        <div className={styles.reserveInfo}>
          <span>홀정보</span>
          <span>{detail && detail[idx]?.GolfCourse?.description}</span>
        </div>

        {/* <div className={styles.reserveInfo}>
          <span>그린피</span>
          <span>
            {detail && `${(detail[idx]?.fee_normal).toLocaleString()}원`}
          </span>
        </div> */}
      </div>
    </>
  );
};

export default ReserveDetail;
