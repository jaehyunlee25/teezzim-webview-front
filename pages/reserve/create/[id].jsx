import Image from 'next/image';
import { useRouter } from 'next/router';
import useAsyncMount from '@/lib/hooks/useAsyncMount';
import axios from 'axios';
import { useState } from 'react';
import { getOffsetFirstDay } from '@/lib/DateUtils';

export default function CreateReservation() {
  const router = useRouter();
  const { id } = router.query;
  const [tee, setTee] = useState({
    id,
    date: '',
    fee_discount: 0,
    fee_normal: 0,
    golf_club_name: '',
    golf_course_name: '',
    time: '',
    GolfCourse: {
      golf_club_id: '',
      name: '',
    },
  });

  const {
    date,
    fee_discount,
    fee_normal,
    golf_club_name,
    golf_course_name,
    time,
    GolfCourse,
  } = tee;

  const dayList = ['일', '월', '화', '수', '목', '금', '토'];
  const [hour, min, _] = time.split(':');
  const [year, mon, _date] = date.split('-');
  const day = dayList[getOffsetFirstDay(date)];
  const { golf_club_id } = GolfCourse;

  const fetchSchedule = async () => {
    const {
      status,
      data: { data, resultCode, message },
    } = await axios.get(`/teezzim/teeapi/v1/schedule/${id}`);
    if (!mountRef.current) return;
    if (status === 200) {
      if (resultCode === 1) {
        console.log(data);
        setTee(data);
        mountRef.current = false;
      } else {
        console.warn(`[errorCode: ${status}] ${message}`);
      }
    } else {
      console.warn(`[errorCode: ${status}] ${message}`);
    }
  };

  const { mountRef } = useAsyncMount(fetchSchedule);

  return (
    <>
      <div id='header'>
        <button
          type='button'
          className='btn-history-back'
          onClick={() => router.back()}
        >
          <span className='offscreen'>이전</span>
        </button>
        <h1 className='headline'>예약하기</h1>
      </div>
      <div id='container'>
        <section className='section-booking'>
          <div className='component-wrap'>
            <div className='booking-img'>
              <div className='img_wrap'>
                <Image
                  src='https://www.mauna.co.kr/MaunaOcean_common/images/homepage/main/main_slider_img02_1230.jpg'
                  alt='golf_header'
                  layout='fill'
                  objectFit='cover'
                />
              </div>
            </div>
          </div>
          <div className='component-wrap'>
            <div className='inner-container'>
              <div className='title-group'>
                <h1 className='head-headline'>{golf_club_name}</h1>
                <ul className='btn-group'>
                  <li>
                    <button type='button' className='btn small round'>
                      골프장 정보
                    </button>
                  </li>
                </ul>
              </div>
              <div className='booking-wrap'>
                <div className='booking-box'>
                  <ul className='desc-list'>
                    <li className='desc-item'>
                      <div className='tit'>라운드 예약일자</div>
                      <div className='desc'>
                        {year}.{mon}.{_date}({day})
                      </div>
                    </li>
                    <li className='desc-item'>
                      <div className='tit'>시간</div>
                      <div className='desc'>
                        {hour}:{min}
                      </div>
                    </li>
                    <li className='desc-item'>
                      <div className='tit'>코스명</div>
                      <div className='desc'>{golf_course_name}</div>
                    </li>
                    {/* <li className='desc-item'>
                      <div className='tit'>홀정보</div>
                      <div className='desc'>18홀</div>
                    </li> */}
                    <li className='desc-item'>
                      <div className='tit'>그린피</div>
                      <div className='desc'>{fee_normal}원</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className='component-wrap'>
            <div className='inner-container info-text pt-0'>
              <p className='text-main'>위약 규정</p>
              <ul className='bul-list bul-dot'>
                <li className='text-warning'>
                  예약일자로부터 7일전 오후 5시 이전까지 예약취소할 수 있습니다.
                </li>
                <li className='text-warning'>
                  예약 취소했던 날짜에는 재예약 할 수 없습니다.
                </li>
                <li>
                  오후 5시 이후 예약 취소시 이용 정지 및 위약금 등의 패널티가
                  있습니다.
                </li>
                <li>자세한 위약규정은 홈페이지를 참고하시기 바랍니다.</li>
                <li className='text-link'>
                  <a href='#'>더플레이어스 [바로가기]</a>
                </li>
              </ul>
            </div>
          </div>

          <div className='component-wrap'>
            <ul className='btn-group btn-group__fixed'>
              <li>
                <button type='button' className='btn large rest full'>
                  간편예약
                </button>
              </li>
              <li>
                <button type='button' className='btn large rest full'>
                  홈페이지예약
                </button>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <style jsx>{`
        .img_wrap {
          width: 100%;
          height: 100px;
          position: relative;
        }
        .btn-group {
          display: flex;
          bottom: 72px;
        }
      `}</style>
    </>
  );
}
