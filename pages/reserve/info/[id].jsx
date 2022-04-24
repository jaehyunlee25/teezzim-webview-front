import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useAsyncMount from '@/lib/hooks/useAsyncMount';
import HomepageLink from '@/components/layouts/reserve/HomepageLink';

export default function GolfClubInfo() {
  const router = useRouter();
  const { id } = router.query; // golf_clud_id
  const [info, setInfo] = useState({});
  const { name, address, phone, email, homepage } = info;

  const fetchGolfClubInfo = async () => {
    const {
      status,
      data: { data, resultCode, message },
    } = await axios.get(`/teezzim/teeapi/v1/club/${id}`);
    if (!mountRef.current) return;
    if (status === 200) {
      if (resultCode === 1) {
        console.log(data);
        setInfo(data);
        mountRef.current = false;
      } else {
        console.warn(`[errorCode: ${status}] ${message}`);
      }
    } else {
      console.warn(`[errorCode: ${status}] ${message}`);
    }
  };

  const { mountRef } = useAsyncMount(fetchGolfClubInfo);

  return (
    <>
      <div id='header'>
        <button type='button' className='btn-history-back'>
          <span className='offscreen'>이전</span>
        </button>
        <h1 className='headline'>{name}</h1>
      </div>

      <div id='container' className=''>
        <section className='section-booking-detail'>
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

          {/* <div className='component-wrap'>
            <div className='ticket-head'>
              <h1 className='text-sub bold'>예약확정</h1>
            </div>
            <ul className='ticket-list'>
              <li className='ticket-item'>
                <div className='ticket-dday'>
                  D-<span>7</span>
                </div>
                <div className='ticket-content'>
                  <p className='title'>4월 4일(월요일)</p>
                  <p className='text'>
                    <span className='time'>06:30</span>
                    <span className='name'>더플레이어스</span>
                    <span className='address'>Valley</span>
                  </p>
                </div>
              </li>
              <li className='ticket-item'>
                <div className='ticket-dday'>
                  D-<span>10</span>
                </div>
                <div className='ticket-content'>
                  <p className='title'>4월 7일(수요일)</p>
                  <p className='text'>
                    <span className='time'>06:30</span>
                    <span className='name'>더플레이어스</span>
                    <span className='address'>Valley</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className='component-wrap'>
            <div className='ticket-head'>
              <h1 className='text-sub bold'>예약대기</h1>
            </div>
            <ul className='ticket-list'>
              <li className='ticket-item waiting'>
                <div className='ticket-dday'>
                  D-<span>15</span>
                  <i className='ico ico-waitingn'>
                    <span className='offscreen'>예약대기</span>
                  </i>
                </div>
                <div className='ticket-content'>
                  <p className='title'>4월 12일(화요일)</p>
                </div>
              </li>
            </ul>
          </div>

          <div className='component-wrap'>
            <div className='ticket-head'>
              <h1 className='text-sub bold'>예약오픈 알림</h1>
            </div>
            <ul className='ticket-list'>
              <li className='ticket-item basic'>
                <div className='ticket-dday'>
                  <i className='ico ico-bell'>
                    <span className='offscreen'>알림</span>
                  </i>
                </div>
                <div className='ticket-content'>
                  <p className='title'>4월 20일(수요일)</p>
                  <p className='text'>4월 13일 오전 9시 오픈</p>
                </div>
              </li>
            </ul>
          </div> */}

          <div className='component-wrap'>
            <div className='inner-container golf-info'>
              <div className='text-group golf-info-head'>
                <h1 className='text-sub bold'>골프장 정보</h1>
              </div>
              <ul className='desc-list bul-list bul-dot'>
                <li className='desc-item'>
                  <div className='tit bul'>주소</div>
                  <div className='desc'>{address}</div>
                </li>
                <li className='desc-item'>
                  <div className='tit'>전화</div>
                  <div className='desc'>
                    <a href={`tel:${phone}`} className='text-link'>
                      {phone}
                    </a>
                  </div>
                </li>
                <li className='desc-item'>
                  <div className='tit'>홈페이지</div>
                  <div className='desc'>
                    <HomepageLink id={id}>{homepage}</HomepageLink>
                  </div>
                </li>
                {/* 정보누락 => <li className='desc-item'>
                  <div className='tit'>규모</div>
                  <div className='desc'>9홀</div>
                </li>
                <li className='desc-item'>
                  <div className='tit'>코스</div>
                  <div className='desc'>
                    <p>IN</p>
                    <p>1번홀</p>
                    <p>골프장 현장 상황에 따라 코스배정 변경가능</p>
                  </div>
                </li> 
                <li className='desc-item'>
                  <div className='tit'>카트피</div>
                  <div className='desc'>80,000원(18H)</div>
                </li>
                <li className='desc-item'>
                  <div className='tit'>캐디피</div>
                  <div className='desc'>130,000원(18H)</div>
                </li>*/}
                <li className='desc-item'>
                  <div className='tit'>위약규정</div>
                  <div className='desc'>
                    <a href='#' className='text-link'>
                      내용보기
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      <style jsx>{`
        .img_wrap {
          width: 100%;
          height: 100px;
          position: relative;
        }
      `}</style>
    </>
  );
}
