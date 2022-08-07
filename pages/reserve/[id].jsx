import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';

import ReserveDetail from '@/components/common/ReserveDetail/ReserveDetail';
import PopUp from '@/components/common/PopUp';
import BottomMenu from '@/components/layouts/BottomMenu';

import Back from '/assets/images/Icon_Back.svg';

import styles from '@/styles/Reserve.module.scss';
import useStores from '@/stores/useStores';

const ReserveInfo = () => {
  const router = useRouter();
  const { authStore } = useStores();
  const [userInfo, setUserInfo] = useState([]);
  const [reserveDetailData, setReserveDetailData] = useState([]);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [isInitSignalSendApp, setIsInitSignal] = useState(false); // 나의예약>상세페이지로 이동했음을 App에 알렸는지 여부

  const [test, setTest] = useState({
    resultCode: 1,
    message: 'OK',
    data: [
      /* {
        id: '09982dcb-0ab4-11ed-a93e-0242ac11000a',
        device_id: '95b7a543-ea1d-11ec-a93e-0242ac11000a',
        golf_club_id: '1b01f7dc-ee3b-11ec-a93e-0242ac11000a',
        golf_course_id: '1b0590d0-ee3b-11ec-a93e-0242ac11000a',
        game_date: '20220819',
        game_time: '0616',
        isCancel: 0,
        created_at: '2022-07-23T18:20:08.000Z',
        updated_at: '2022-07-23T18:20:08.000Z',
        createdAt: '2022-07-23T18:20:08.000Z',
        updatedAt: '2022-07-23T18:20:08.000Z',
        Device: {
          id: '95b7a543-ea1d-11ec-a93e-0242ac11000a',
          token:
            'dojdZqaQRR-Xf-7sl05bY6:APA91bGNoMmJZZTERSqD311_6GTtAZoZH2ZTStXbrEZ6vCMTa50dkcD0xf64LfbOJHgtjtGeUcnI_VwgexrNbLY0bB30AbtW9jlImnkQDRF2jFyXqewSvQJ_yCFP22OcwUGa9MUCYRIp',
          type: 'admin',
          created_at: '2022-06-12T07:02:23.000Z',
          updated_at: '2022-06-12T07:02:23.000Z',
        },
        GolfClub: {
          id: '1b01f7dc-ee3b-11ec-a93e-0242ac11000a',
          name: '클럽모우',
          address: '강원도 홍천군 서면 장락동길 111',
          phone: '033-439-9000',
          area: '강원도',
          email: '',
          homepage: 'http://www.clubmow.com/_mobile/index.asp',
          corp_reg_number: '227-86-01869',
          description: '3년연속소비자만족10대골프장',
        },
        GolfCourse: {
          id: '1b0590d0-ee3b-11ec-a93e-0242ac11000a',
          golf_club_id: '1b01f7dc-ee3b-11ec-a93e-0242ac11000a',
          name: '마운틴',
          description: '9홀',
          createdAt: '2022-06-17T12:43:48.000Z',
          updatedAt: '2022-06-17T12:43:48.000Z',
          GolfClubId: '1b01f7dc-ee3b-11ec-a93e-0242ac11000a',
        },
      }, */
    ],
  });
  console.log('🚀 - test', test);
  let idx = 0;
  if( test && test.data && router.query.id) {
    idx = test.data.findIndex(item =>{
      console.log(item);
      return item.id == router.query.id
    });
  }
  
  // 취소 팝업
  const [confirmHidden, setConfirmHidden] = useState(true);
  const [reserveData, setReserveData] = useState({});

  useEffect(() => {
    if(window){
      console.log("### responseReserveCancel 바인딩됨");
      /** APP->WEB */
      window.responseReserveCancel = function (result) {
        console.log("### responseReserveCancel 호출됨 " + result);
        if ( result == "OK" ){
          // TODO 성공 팝업으로 처리하도록 변경
          router.push({
            pathname: '/reserve',
            query: { tab: 'my_book' },
          });
        } else {
          alert("취소에 실패했습니다."); // TODO 웹뷰 팝업으로 처리
        }
      };
    }
  }, []);

  const handleCancel = async () => {
    const item = test.data[idx];
    const data = {
      club: item.GolfClub.GolfClubEng.eng_id,
      club_id: item.GolfClub.id,
      year: item.game_date.substring(0,4),
      month: item.game_date.substring(4,6),
      date: item.game_date.substring(6,8),
      time: item.game_time,
      course: item.GolfCourse.name,
    }
    // console.log("###", data);
    // 예약하기 브릿지 메소드 호출
    if (window.BRIDGE && window.BRIDGE.requestReserveCancel) {
      window.BRIDGE.requestReserveCancel(JSON.stringify(data));
    } else if (window.webkit && window.webkit.messageHandlers ) {
      window.webkit.messageHandlers.requestReserveCancel.postMessage(JSON.stringify(data));
    } else {
      alert('이 기능은 앱에서만 동작합니다.' + JSON.stringify(params));
    }
  };

  useEffect(() => {
    if (isInitSignalSendApp == false) {
      // console.log('한번만 수행되야 할텐데..');
      if (window) {
        window.getMyReserveDetailForApi = function (jsonStr) {
          console.log('getMyReserveDetailForApi', jsonStr); // device_id 필요
          const { device_id } = JSON.parse(jsonStr);
          axios({
            method: 'post',
            url: `/teezzim/teeapi/v1/club/reservation`,
            data: { device_id },
          }).then(resp => {
            console.log(resp);
            setTest(resp.data);
          }).catch(err => {
            console.log(err);
          });
        };

        if (window.BRIDGE && window.BRIDGE.openWebMenu) {
          setTimeout(() => {
            window.BRIDGE.openWebMenu('MyReservationDetail');
          }, 100); // 약간 지연
        } else if (window.webkit && window.webkit.messageHandlers) {
          setTimeout(() => {
            window.webkit.messageHandlers.openWebMenu.postMessage('MyReservationDetail');
          }, 100);
        } else {
          // TODO 웹뷰에서 불가능..
        }
      }
    }
    setIsInitSignal(true);
  }, [isInitSignalSendApp]);

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
        {/* <p>{reserveDetailData?.golf_club?.name}</p> */}
        <p>{test?.data[idx]?.GolfClub?.name}</p>
        <button
          onClick={() =>
            // router.push(`/reserve/info/${reserveDetailData?.golf_club?.id}`)
            router.push(`/reserve/info/${test?.data[idx]?.GolfClub?.id}`)
          }
          className={styles.sideBtn}
          style={{ width: '90px' }}
        >
          골프장 정보
        </button>
      </div>

      <div className={styles.reserveContainer}>
        {/* <ReserveDetail detail={reserveDetailData.data} /> */}
        <ReserveDetail detail={test.data} idx={idx} />
      </div>

      <div className={styles.ruleContainer}>
        <h4>위약 규정</h4>

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
          <li
            onClick={() =>
              // window.open(`${reserveDetailData?.golf_club?.homepage}`)
              window.open(`${test?.data[idx]?.GolfClub?.homepage}`)
            }
          >
            {/* {reserveDetailData?.golf_club?.name} [바로가기] */}
            {test?.data[idx]?.GolfClub?.name} [바로가기]
          </li>
        </ul>
      </div>

      <div className={styles.btnContainer}>
        <button onClick={() => setConfirmHidden(false)}>
          홈페이지 예약 취소
        </button>
      </div>

      <PopUp
        buttonText='확인'
        onButtonClick={() => {
          handleCancel();
        }}
        hidden={confirmHidden}
        cancelButtonClick={()=>setConfirmHidden(true)}
      >
        <div className='component-wrap'>
          <div className='inner-container'>
            <ul className='desc-list'>
              <li className='desc-item'>
                <div className='tit'>
                  <em>예약일자</em>
                </div>
                <div className='desc'>
                  <span>
                    {/* {reserveDetailData.status === 'okay'
                      ? reserveDetailData?.data[idx]?.reserved_date
                      : null} */}
                    {test.resultCode === 1
                      ? `${test?.data[idx]?.game_date.substring(
                          0,
                          4,
                        )}-${test?.data[idx]?.game_date.substring(
                          4,
                          6,
                        )}-${test?.data[idx]?.game_date.substring(6, 8)}`
                      : null}
                  </span>
                </div>
              </li>
              <li className='desc-item'>
                <div className='tit'>
                  <em>시간</em>
                </div>
                <div className='desc'>
                  <span>
                    {/* {reserveDetailData.status === 'okay'
                      ? reserveDetailData?.data[idx]?.reserved_time
                      : null} */}
                    {test.resultCode === 1
                      ? `${test?.data[idx]?.game_time.substring(
                          0,
                          2,
                        )}:${test?.data[idx]?.game_time.substring(2, 4)}`
                      : null}
                  </span>
                </div>
              </li>
              <li className='desc-item'>
                <div className='tit'>
                  <em>코스명</em>
                </div>
                <div className='desc'>
                  <span>
                    {/* {reserveDetailData.status === 'okay'
                      ? `${reserveDetailData?.data[idx]?.reserved_course} 코스`
                      : null} */}
                    {test.resultCode === 1
                      ? test?.data[idx]?.GolfCourse?.name
                      : null}
                  </span>
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

      {/* <Toast message='골프장을 1개 이상 선택해 주세요.' /> */}
      <BottomMenu />
    </>
  );
};

export default ReserveInfo;
