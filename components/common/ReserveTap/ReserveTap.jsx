import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';

import PopUp from '../PopUp';

import Arrow from '/assets/images/arrow.svg';
import Time from '/assets/images/Icon_time.svg';
import Bell from '/assets/images/Icon_bell.svg';
import Trash from '/assets/images/Icon_trash.svg';

import styles from './ReserveTap.module.scss';

const ReserveTap = ({ index, userInfo, reserve, reserveData, deleteItem }) => {
  const router = useRouter();

  // 취소 팝업
  const [confirmHidden, setConfirmHidden] = useState(true);

  const handleCancel = async index => {
    const { data } = reserveData;
    console.log('🚀 - data', data);
    console.log('🚀 - year', data[index]?.reserved_date?.split('.')[1]);
    console.log('🚀 - month', data[index]?.reserved_date?.split('.')[0]);
    console.log('🚀 - date', data[index]?.reserved_date?.split('.')[2]);
    console.log('🚀 - course', data[index]?.reserved_course);
    console.log('🚀 - time', data[index]?.reserved_time?.replace(':', ''));

    const { status } = await axios
      .post(`/teezzim/teeapi/v1/club/${router?.query?.id}/reservation/cancel`, {
        id: userInfo[0]?.id,
        password: userInfo[0]?.password,
        year: data[index]?.reserved_date.split('.')[0],
        month: data[index]?.reserved_date.split('.')[1],
        date: data[index]?.reserved_date.split('.')[2],
        course: data[index]?.reserved_course,
        time: data[index]?.reserved_time.replace(':', ''),
      })
      .catch(err => console.warn(err));

    if (status === 200) {
      setConfirmHidden(true);
      router.push({
        pathname: '/reserve',
        query: { tab: 'my_book' },
      });
      window.location.reload();
    }
  };

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
              {`${reserve?.reserved_time} | ${reserve?.golf_club?.area} | ${reserve?.reserved_course} 코스`}
            </span>
          </div>
        </div>

        {deleteItem ? (
          <div className={styles.trash} onClick={() => setConfirmHidden(false)}>
            <Image src={Trash} alt='arrow' width={25} height={25} />
          </div>
        ) : (
          <Image
            src={Arrow}
            alt='arrow'
            width={5}
            height={26}
            onClick={() =>
              router.push({
                pathname: `/reserve/${reserve?.golf_club?.id}`,
                query: { tab: 'my_book' },
              })
            }
          />
        )}

        <PopUp
          buttonText='확인'
          onButtonClick={() => {
            handleCancel(index);
          }}
          hidden={confirmHidden}
        >
          <div className='component-wrap'>
            <div className='inner-container'>
              <ul className='desc-list'>
                <li className='desc-item'>
                  <div className='tit'>
                    <em>예약일자</em>
                  </div>
                  <div className='desc'>
                    <span>{reserve?.reserved_date}</span>
                  </div>
                </li>
                <li className='desc-item'>
                  <div className='tit'>
                    <em>시간</em>
                  </div>
                  <div className='desc'>
                    <span>{reserve?.reserved_time}</span>
                  </div>
                </li>
                <li className='desc-item'>
                  <div className='tit'>
                    <em>코스명</em>
                  </div>
                  <div className='desc'>
                    <span>{reserve?.reserved_course}</span>
                  </div>
                </li>
                {/* <li className='desc-item'>
                <div className='tit'>
                  <em>홀정보</em>
                </div>
                <div className='desc'>
                  <span>18홀</span>
                </div>
              </li>
              <li className='desc-item'>
                <div className='tit'>
                  <em>그린피</em>
                </div>
                <div className='desc'>123123123</div>
              </li> */}
              </ul>
            </div>
            <div className='message-box line2-top pt-15'>
              <p>예약을 취소하시겠습니까?</p>
              <span>취소한 날짜에는</span>
              <span>다시 예약 할 수 없습니다.</span>
            </div>
          </div>
        </PopUp>
      </div>
    </>
  );
};

export default ReserveTap;
