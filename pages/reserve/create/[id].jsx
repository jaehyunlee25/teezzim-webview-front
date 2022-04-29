import Image from 'next/image';
import { useRouter } from 'next/router';
import useAsyncMount from '@/lib/hooks/useAsyncMount';
import axios from 'axios';
import { useState, useCallback, useEffect } from 'react';
import { getOffsetFirstDay } from '@/lib/DateUtils';
import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import PopUp from '@/components/common/PopUp';
import HomepageLink from '@/components/layouts/reserve/HomepageLink';
import UnregisteredMsg from '@/components/layouts/reserve/create/UnregisteredMsg';

export default function CreateReservation() {
  const router = useRouter();
  const { id, tee_id } = router.query;
  const { panelStore, authStore } = useStores();

  const [tee, setTee] = useState({});

  const {
    date = '',
    fee_discount = '',
    fee_normal = '',
    golf_club_name = '',
    golf_course_name = '',
    time = '',
  } = tee ?? {};

  const dayList = ['일', '월', '화', '수', '목', '금', '토'];
  const [hour, min, _] = time?.split(':') ?? [];
  const [year, mon, _date] = date?.split('-') ?? [];
  const day = dayList[getOffsetFirstDay(date) ?? 0];
  const fee = String(fee_normal ?? '')
    .split('')
    .reverse()
    .reduce((acc, cur, i) => {
      return i < String(fee_normal).length - 1 && (i + 1) % 3 === 0
        ? [...acc, cur, ',']
        : [...acc, cur];
    }, [])
    .reverse()
    .join('');

  const fetchSchedule = useCallback(async () => {
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
  }, [id]);

  const { mountRef } = useAsyncMount(fetchSchedule);

  const [isInitSignalSendApp, setIsInitSignal] = useState(false); // 이 메뉴로 이동했음을 App에 알렸는지 여부
  /** APP<->WEB 브릿지 함수용 */
  useEffect(() => {
    if (!isInitSignalSendApp && !authStore.communicated) {
      if (window) {
        // window 존재여부 체크 (nextjs 특징)
        /** 로그인 APP->WEB 전송 */
        window.getSavedAuth = function (jsonStr) {
          console.log(jsonStr);
          // 데이터 샘플: [{"clubId":"골프장식별자","id":"아이디","password":"패스워드"}]
          const dataList = JSON.parse(jsonStr);
          panelStore.setRegisteredKeys(dataList.map(({ clubId }) => clubId));
          authStore.saveAuthList(dataList);
          authStore.communicate();
          // setSavedAuthList(dataList);
        };

        /** 예약하기 탭 열림완료 WEB->APP 전송 */
        if (window.BRIDGE && window.BRIDGE.openWebMenu) {
          setTimeout(() => {
            window.BRIDGE.openWebMenu('Reservation');
          }, 100); // 약간 지연
        } else {
          setTimeout(() => {
            // 웹뷰에서는 테스트 데이터로!
            window.getSavedAuth(
              `[{"clubId":"6cbc1160-79af-11ec-b15c-0242ac110005","id":"newrison","password":"ilovegolf778"}]`,
            );
          }, 1000);
        }
      }
      setIsInitSignal(true);
    }
  }, [isInitSignalSendApp, panelStore, authStore]);

  /** PopUp Status */
  const [cancelHidden, setCancelHidden] = useState(true);
  const [confirmHidden, setConfirmHidden] = useState(true);
  const handleOpen = type =>
    type === 'confirm' ? setConfirmHidden(false) : setCancelHidden(false);
  const handleClose = type =>
    type === 'confirm' ? setConfirmHidden(true) : setCancelHidden(true);

  /** Axios Cancel Token */
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
                      <div className='desc'>{fee}원</div>
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
                <HomepageLink id={tee_id}>
                  {golf_club_name} [바로가기]
                </HomepageLink>
              </ul>
            </div>
          </div>
          {/** 기획에서는 간편예약이 가능한 골프장에 한해서만 간편예약을 렌더링하라고 기재되어있는데 어디에서 받아야할지 모르겠음 */}
          {tee && (
            <ButtonGroup
              clubId={tee_id}
              postInfo={{
                year,
                month: mon,
                date: _date,
                course: golf_course_name?.split(' ')[0],
                time: hour + min,
              }}
              source={source}
              onButtonClick={() => handleOpen('cancel')}
              cb={() => handleOpen('confirm')}
            />
          )}
        </section>
      </div>
      <PopUp
        buttonText='취소'
        buttonType='cancel'
        onButtonClick={() => {
          handleClose('cancel');
          source.cancel('요청 취소');
        }}
        hidden={cancelHidden}
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
      <PopUp
        buttonText='확인(홈으로 이동)'
        onButtonClick={() => {
          handleClose('confirm');
          router.push({
            pathname: '/home',
            query: { tab: 'book' },
          });
        }}
        hidden={confirmHidden}
      >
        <div className='component-wrap'>
          <div className='inner-container'>
            <ul className='desc-list'>
              <li className='desc-item'>
                <div className='tit'>
                  <em>라운드 예약일자</em>
                </div>
                <div className='desc'>
                  <span>
                    {year}.{mon}.{_date}({day}){' '}
                  </span>
                </div>
              </li>
              <li className='desc-item'>
                <div className='tit'>
                  <em>시간</em>
                </div>
                <div className='desc'>
                  <span>
                    {hour}:{min}
                  </span>
                </div>
              </li>
              <li className='desc-item'>
                <div className='tit'>
                  <em>코스명</em>
                </div>
                <div className='desc'>
                  <span>{golf_course_name}</span>
                </div>
              </li>
              {/* <li className='desc-item'>
                <div className='tit'>
                  <em>홀정보</em>
                </div>
                <div className='desc'>
                  <span>18홀</span>
                </div>
              </li> */}
              <li className='desc-item'>
                <div className='tit'>
                  <em>그린피</em>
                </div>
                <div className='desc'>
                  <span>{fee}원</span>
                </div>
              </li>
            </ul>
          </div>
          <div className='message-box line2-top pt-15'>
            <p>예약을 완료했습니다.</p>
          </div>
        </div>
      </PopUp>
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

const ButtonGroup = observer(
  ({ clubId, postInfo, source, cb, onButtonClick }) => {
    const { panelStore, authStore } = useStores();
    // account 넘어 왔다고 가정
    // const account = {
    //   id: 'newrison',
    //   password: 'ilovegolf778',
    // };
    const [{ id, password } = {}] =
      authStore.authList?.filter(auth => auth.clubId == clubId) ?? [];

    const handleCreateReserve = async () => {
      if (!id || !password) return;
      if (onButtonClick) onButtonClick();
      const { status, data: { data, resultCode, message } = {} } = await axios
        .post(
          `/teezzim/teeapi/v1/club/${id}/reservation/post`,
          {
            id,
            password,
            ...postInfo,
          },
          { cancelToken: source.token },
        )
        .catch(({ message }) => {
          console.warn(message);
          return err;
        });

      if (status === 200) {
        console.log(resultCode, message, data);
        if (resultCode === 1) {
          if (cb) cb();
        } else {
          console.warn(`[errorCode : ${resultCode}] ${message}`);
        }
      } else {
        handleClose('cancel');
      }
    };
    return (
      <>
        {panelStore.registeredKeys.includes(clubId) ? (
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
                <HomepageLink
                  id={clubId}
                  type='button'
                  className='btn large rest full'
                >
                  홈페이지예약
                </HomepageLink>
              </li>
            </ul>
          </div>
        ) : (
          <div className='component-wrap'>
            <ul className='btn-group btn-group__fixed'>
              <HomepageLink
                id={clubId}
                type='button'
                className='btn large rest full'
              >
                골프장 회원가입
              </HomepageLink>

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
  },
);
