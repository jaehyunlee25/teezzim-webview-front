import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';

import ReserveDetail from '@/components/common/ReserveDetail/ReserveDetail';
import BottomMenu from '@/components/layouts/BottomMenu';

import Back from '/assets/images/Icon_Back.svg';

import styles from '@/styles/Reserve.module.scss';

const ReserveInfo = () => {
  const router = useRouter();
  const [reserveDetailData, setReserveDetailData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.post(
        `/teezzim/teeapi/v1/club/${router.query.id}/reservation/confirm`,
        { id: 'newrison', password: 'ilovegolf778' },
      );
      const res = await data?.data;
      setReserveDetailData(res?.data?.data);
    };

    fetchData();
  }, [router.query.id]);

  return (
    <>
      <div className={styles.topNav} style={{ backgroundColor: 'white' }}>
        <Image
          src={Back}
          alt='Back'
          width={24}
          height={24}
          onClick={() => router.back()}
        />

        <div className={styles.centerMenu}>
          <h4>예약정보</h4>
        </div>
      </div>

      <div className={styles.reserveTitle}>
        <p>{reserveDetailData[0]?.golf_club?.name}</p>
        <button className={styles.sideBtn} style={{ width: '90px' }}>
          골프장 정보
        </button>
      </div>

      <div className={styles.reserveContainer}>
        <ReserveDetail detail={reserveDetailData[0]} />
      </div>

      <div className={styles.ruleContainer}>
        <h4>위약 규정</h4>

        <ul>
          <li>
            예약일자로부터 7일전 오후 5시 이전까지 예약취소 할 수 있습니다.
          </li>
          <li>예약 취소했던 날짜에는 재예약 할 수 없습니다.</li>
          <li>
            오후 5시 이후 예약 취소시 이용 정지 및 위약금 등의 패널티가
            있습니다.
          </li>
          <li>자세한 위약규정은 홈페이지를 참고하시기 바랍니다.</li>
          <li
            onClick={() =>
              window.open(`${reserveDetailData[0]?.golf_club?.homepage}`)
            }
          >
            {reserveDetailData[0]?.golf_club?.name} [바로가기]
          </li>
        </ul>
      </div>

      <div className={styles.btnContainer}>
        <button>홈페이지 예약 취소</button>
      </div>

      {/* <Toast message='골프장을 1개 이상 선택해 주세요.' /> */}
      <BottomMenu />
    </>
  );
};

export default ReserveInfo;
