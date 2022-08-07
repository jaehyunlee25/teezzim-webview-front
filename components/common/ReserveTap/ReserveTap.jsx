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

const ReserveTap = (props) => {
  // console.log("###props", props);
  const {
    type,
    index,
    userInfo,
    reserve,
    reserveData,
    deleteItem,
    clubName,
    waitDate,
    waitTime,
    alarmDate,
    dDay,
  } = props;
  console.log('🚀 - reserveData', reserveData);
  const router = useRouter();
  // 취소 팝업
  const [confirmHidden, setConfirmHidden] = useState(true);
  const year = reserve?.game_date.substring(0, 4);
  const month = reserve?.game_date.substring(4,6);
  const day = reserve?.game_date.substring(6, 8);
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  const reserveDate = new Date(`${year}-${month}-${day}`);
  const waitDay = new Date(waitDate);
  const alarmDay = new Date(alarmDate);

  const handleReserveCancel = async index => {
    const { data } = reserveData;
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

  const handleWaitCancel = () => {};

  console.log("###2", reserve);

  return (
    <>
      <div className={styles.reserveTapContainer}>
        <div className={styles.dateInfo}>
          <div className={styles.alert}>
            {
              type === 'reserve' && (
                <span>{`D-${dDay}`}</span>
              )
            }
            {
              type === 'wait' && (
                <div class="info_top fl">
                  <b class="icon-time">time</b>
                </div>
              )
            }
            {
              type === 'alarm' && (
                <div class="info_top fl">
                  <b class="icon-bell">bell</b>
                </div>
              )
            }
          </div>
          {type === 'reserve' && (
            <div>
              <span>{`${month}월 ${day}일(${week[reserveDate.getDay()]}요일)`}&nbsp;&nbsp;{`${reserve?.GolfClub?.name}`}</span>
              <span>
                {`${reserve?.game_time.substring(0,2,)}:${reserve?.game_time.substring(2, 4)}`}
                <b className="bar"></b>
                {`${reserve?.GolfClub?.area}`}
                <b className="bar"></b>
                {`${reserve?.GolfCourse?.name??'단일'} 코스`}
                {/* time / area / course */}
              </span>
            </div>
          )}

          {type === 'wait' && (
            <div>
              <span>{`${waitDate.substring(5,7)}월 ${waitDate.substring(8,10)}일(${week[waitDay.getDay()]}요일)`}</span>
              <span>{`${clubName} `}</span>
              {/* <div className={styles.waitTime}>
                {waitTime?.map((item, index) => (
                  <p
                    key={index}
                    style={{ margin: '0.1rem', fontSize: '0.5rem' }}
                  >
                    {item.slice(0, 5).replace('', ' ')}
                  </p>
                ))}
              </div> */}
            </div>
          )}

          {type === 'alarm' && (
            <div>
              <span>{`${alarmDate.substring(5,7)}월 ${alarmDate.substring(8,10)}일(${week[alarmDay.getDay()]}요일)`}</span>
              <span>{`${clubName} `}</span>
            </div>
          )}
        </div>

        {deleteItem ? (
          <div className={styles.trash} onClick={() => setConfirmHidden(false)}>
            <Image src={Trash} alt='arrow' width={25} height={25} />
          </div>
        ) : (
          <>
            {type === 'reserve' ? (
              <Image
                src={Arrow}
                alt='arrow'
                width={5}
                height={26}
                onClick={() =>
                  router.push({
                    pathname: `/reserve/${reserve.id}`,
                    query: { tab: 'my_book' },
                  })
                }
              />
            ) : null}
          </>
        )}

        <PopUp
          buttonText='확인'
          onButtonClick={() => handleReserveCancel(index)}
          hidden={confirmHidden}
        >
          <div className='component-wrap'>
            {type === 'reserve' ? (
              <div className='inner-container'>
                <ul className='desc-list'>
                  <li className='desc-item'>
                    <div className='tit'>
                      <em>예약일자</em>
                    </div>
                    <div className='desc'>
                      <span>{`${reserve?.game_date.substring(
                        0,
                        4,
                      )}-${reserve?.game_date.substring(
                        4,
                        6,
                      )}-${reserve?.game_date.substring(6, 8)}`}</span>
                    </div>
                  </li>
                  <li className='desc-item'>
                    <div className='tit'>
                      <em>시간</em>
                    </div>
                    <div className='desc'>
                      <span>{`${reserve?.game_time.substring(
                        0,
                        2,
                      )}:${reserve?.game_time.substring(2, 4)}`}</span>
                    </div>
                  </li>
                  <li className='desc-item'>
                    <div className='tit'>
                      <em>코스명</em>
                    </div>
                    <div className='desc'>
                      <span>{reserve?.GolfCourse?.name}</span>
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
            ) : (
              <>
                {type === 'wait' ? (
                  <div
                    className='inner-container'
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>{waitDate}</span>
                    <span>{`${clubName} `}</span>
                    <div
                      className={styles.waitTime}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}
                    >
                      {waitTime?.map((item, index) => (
                        <p
                          key={index}
                          style={{ margin: '0.1rem', fontSize: '0.5rem' }}
                        >
                          {item.slice(0, 5).replace('', ' ')}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className='inner-container'
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>{alarmDate}</span>
                    <span>{`${clubName} `}</span>
                  </div>
                )}
              </>
            )}

            <div className='message-box line2-top pt-15'>
              {type === 'reserve' ? (
                <>
                  <p>예약을 취소하시겠습니까?</p>
                  <span>취소한 날짜에는</span>
                  <span>다시 예약 할 수 없습니다.</span>
                </>
              ) : (
                <>
                  {type === 'wait' ? (
                    <>
                      <p>대기를 취소하시겠습니까?</p>
                    </>
                  ) : (
                    <>
                      <p>알람 받기를 취소하시겠습니까?</p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </PopUp>
      </div>
    </>
  );
};

export default ReserveTap;
