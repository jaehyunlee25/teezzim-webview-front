import Image from 'next/image';
import { useRouter } from 'next/router';
import useAsyncMount from '@/lib/hooks/useAsyncMount';
import axios from 'axios';
import { useState } from 'react';
import { getOffsetFirstDay } from '@/lib/DateUtils';
import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import PopUp from '@/components/common/PopUp';

export default function CreateReservation() {
  const router = useRouter();
  const { id, tee_id } = router.query;
  const [tee, setTee] = useState({
    id,
    date: '2022-04-24',
    fee_discount: 0,
    fee_normal: 0,
    golf_club_name: '',
    golf_course_name: '',
    time: '',
  });

  const {
    date,
    fee_discount,
    fee_normal,
    golf_club_name,
    golf_course_name,
    time,
  } = tee;

  const dayList = ['일', '월', '화', '수', '목', '금', '토'];
  const [hour, min, _] = time?.split(':');
  const [year, mon, _date] = date?.split('-');
  const day = dayList[getOffsetFirstDay(date)];

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

  const [hidden, setHidden] = useState(true);
  const handleOpen = () => setHidden(false);
  const handleClose = () => setHidden(true);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

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
                    <button
                      type='button'
                      className='btn small round'
                      onClick={() =>
                        router.push({
                          pathname: '/reserve/info/[id]',
                          query: { ...router.query, id: tee_id },
                        })
                      }
                    >
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
                    {/* 정보 누락(홀정보) <li className='desc-item'>
                      <div className='tit'>홀정보</div>
                      <div className='desc'>18홀</div>
                    </li> */}
                    <li className='desc-item'>
                      <div className='tit'>그린피</div>
                      <div className='desc'>{fee_normal}원</div>
                    </li>
                  </ul>
                </div>
                <UnregisteredMsg id={tee_id} />
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
                <HompageLink id={tee_id}>
                  {golf_club_name} [바로가기]
                </HompageLink>
              </ul>
            </div>
          </div>
          {/** 기획에서는 간편예약이 가능한 골프장에 한해서만 간편예약을 렌더링하라고 기재되어있는데 어디에서 받아야할지 모르겠음 */}
          <ButtonGroup
            id={tee_id}
            postInfo={{
              year,
              month: mon,
              date: _date,
              course: golf_course_name.split(' ')[0],
              time: hour + min,
            }}
            source={source}
            onButtonClick={() => setHidden(false)}
          />
        </section>
      </div>
      <PopUp
        buttonText='취소'
        buttonType='cancel'
        onButtonClick={() => {
          source.cancel('요청 취소');
          handleClose();
        }}
        hidden={hidden}
      >
        <div className='message-box loading-box'>
          <div className='loading-box'>
            <div className='loading-icon'>
              <span className='offscreen'>예약 중 입니다.</span>
            </div>
            <div className='loading-text ml-10'>예약 중 입니다.</div>
          </div>
        </div>
      </PopUp>
      {/* <PopUp>
        <div className='component-wrap'>
          <div className='inner-container'>
            <ul className='desc-list'>
              <li className='desc-item'>
                <div className='tit'>
                  <em>라운드 예약일자</em>
                </div>
                <div className='desc'>
                  <span>2022. 4. 4(화) </span>
                </div>
              </li>
              <li className='desc-item'>
                <div className='tit'>
                  <em>시간</em>
                </div>
                <div className='desc'>
                  <span>7:51</span>
                </div>
              </li>
              <li className='desc-item'>
                <div className='tit'>
                  <em>코스명</em>
                </div>
                <div className='desc'>
                  <span>Valley</span>
                </div>
              </li>
              <li className='desc-item'>
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
                <div className='desc'>
                  <span>230,000원</span>
                </div>
              </li>
            </ul>
          </div>
          <div className='message-box line2-top pt-15'>
            <p>예약을 완료했습니다.</p>
          </div>
        </div>
      </PopUp> */}
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

const HompageLink = observer(({ id, children, ...props }) => {
  const { panelStore } = useStores();
  const url = panelStore.teeListMap?.[id]?.homepage;
  return (
    <li className='text-link'>
      <Link href={{ pathname: '/golf_homepage/[url]', query: { url } }}>
        <a {...props}>{children}</a>
      </Link>
    </li>
  );
});

const ButtonGroup = observer(({ id, postInfo, source, cb, onButtonClick }) => {
  const { panelStore } = useStores();
  // account 넘어 왔다고 가정
  const account = {
    id: 'newrison',
    password: 'ilovegolf778',
  };

  const handleCreateReserve = async () => {
    if (onButtonClick) onButtonClick();
    const {
      status,
      data: { data, resultCode, message },
    } = await axios.post(
      `/teezzim/teeapi/v1/club/${id}/reservation/post`,
      {
        ...account,
        ...postInfo,
      },
      { cancelToken: source.token },
    );
    if (status === 200) {
      console.log(data);
      if (resultCode === 1) {
        if (cb) cb();
      } else {
        console.warn(`[errorCode : ${resultCode}] ${message}`);
      }
    } else {
      console.warn(`[errorCode : ${status}] ${message}`);
    }
  };
  return (
    <>
      {panelStore.registeredKeys.includes(id) ? (
        <div className='component-wrap'>
          <ul className='btn-group btn-group__fixed'>
            <li>
              <button
                type='button'
                className='btn large rest full'
                onClick={handleCreateReserve}
              >
                간편예약
              </button>
            </li>
            <li>
              <HompageLink
                id={id}
                type='button'
                className='btn large rest full'
              >
                홈페이지예약
              </HompageLink>
            </li>
          </ul>
        </div>
      ) : (
        <div className='component-wrap'>
          <ul className='btn-group btn-group__fixed'>
            <li>
              <HompageLink
                id={id}
                type='button'
                className='btn large rest full'
              >
                골프장 회원가입
              </HompageLink>
            </li>
            <li>
              <button type='button' className='btn large rest full'>
                골프장 계정등록
              </button>
            </li>
          </ul>
        </div>
      )}
      <style jsx>{`
        .btn-group {
          display: flex;
          bottom: 72px;
        }
      `}</style>
    </>
  );
});

const UnregisteredMsg = observer(({ id }) => {
  const { panelStore } = useStores();
  return !panelStore.registeredKeys.includes(id) ? (
    <div className='desc-text'>
      미등록 골프장입니다. 골프장 회원으로 가입해세요. 골프장 회원이라면
      계정등록 후 이용하실 수 있습니다.
    </div>
  ) : (
    <></>
  );
});
