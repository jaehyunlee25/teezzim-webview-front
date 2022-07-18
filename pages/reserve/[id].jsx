import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import useSWR from 'swr';

import ReserveDetail from '@/components/common/ReserveDetail/ReserveDetail';
import PopUp from '@/components/common/PopUp';
import BottomMenu from '@/components/layouts/BottomMenu';

import Back from '/assets/images/Icon_Back.svg';

import styles from '@/styles/Reserve.module.scss';

const ReserveInfo = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState([]);
  console.log('🚀 - userInfo', userInfo);
  const [reserveDetailData, setReserveDetailData] = useState([]);
  console.log('🚀 - reserveDetailData', reserveDetailData);
  const [cancelLoading, setCancelLoading] = useState(false);

  // 취소 팝업
  const [confirmHidden, setConfirmHidden] = useState(true);

  // const { data } = useSWR(
  //   `/teezzim/teeapi/v1/schedule/club/${router.query.id}`,
  // );
  // console.log('🚀 - data', data);

  const [isInitSignalSendApp, setIsInitSignal] = useState(false); // 나의예약 탭으로 이동했음을 App에 알렸는지 여부
  const [reserveData, setReserveData] = useState({});
  /** APP->WEB 브릿지 함수 선언 */
  useEffect(() => {
    if (isInitSignalSendApp == false) {
      console.log('한번만 수행될까?');
      if (window) {
        // window 존재여부 체크 (nextjs 특징)
        /** 로그인 APP->WEB 전송 */
        window.getSavedAuth = function (jsonStr) {
          setUserInfo(JSON.parse(jsonStr));
          // 데이터 샘플: [{"clubId":"골프장식별자","id":"아이디","password":"패스워드"}]
          const dataList = JSON.parse(jsonStr);
          // console.log(dataList);
          for (let i = 0; i < dataList.length; i++) {
            const data = dataList[i];
            handleGetReservationInfo(data.clubId, data.id, data.password);
            // TODO 배열일 경우에는??
          }
        };

        /** 예약 정보 APP->WEB 전송 */
        // window.getAppData = function (jsonStr) {
        //   const data = JSON.parse(jsonStr);
        //   console.log(data);
        //   // TODO 예약 확정 메뉴에 띄움?
        // };

        if (window.BRIDGE && window.BRIDGE.openWebMenu) {
          setTimeout(() => {
            /** 나의 예약 탭 열림 여부 WEB->APP 전송 */
            window.BRIDGE.openWebMenu('MyReservation');
          }, 300); // 약간 지연
        } else if (window.webkit && window.webkit.messageHandlers ) {
          setTimeout(() => {
            window.webkit.messageHandlers.openWebMenu.postMessage('MyReservation');
          }, 100);
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
  }, []);

  const handleGetReservationInfo = function (club, id, password) {
    console.log(club);
    axios({
      method: 'POST',
      url: `/teezzim/teeapi/v1/club/${club}/reservation/confirm`,
      data: { id, password },
    })
      .then(({ data: respData }) => {
        for (let idx = 0; idx < respData.data.data.length; idx++) {
          respData.data.data[idx].golf_club = respData.data.golf_club;
        }
        setReserveData(respData.data);
        if (window) {
          const jsonStr = JSON.stringify({
            club,
            data: respData.data,
            golf_info: respData.golf_club,
          });
          // 앱으로 전송
          if (window.BRIDGE && window.BRIDGE.saveReservationList) {
            window.BRIDGE.saveReservationList(jsonStr);
          } else if (window.webkit && window.webkit.messageHandlers ) {
            window.webkit.messageHandlers.saveReservationList.postMessage(jsonStr);
          }
        }
      })
      .catch(err => {
        console.error(err);
        alert('통신중 문제가 발생하였습니다. 관리자에게 문의해주세요.');
      });
  };

  const handleCancel = async () => {
    const { data } = reserveData;
    const { status } = await axios
      .post(`/teezzim/teeapi/v1/club/${router?.query?.id}/reservation/cancel`, {
        id: userInfo[0]?.id,
        password: userInfo[0]?.password,
        year: data[0]?.reserved_date.split('.')[0],
        month: data[0]?.reserved_date.split('.')[1],
        date: data[0]?.reserved_date.split('.')[2],
        course: data[0]?.reserved_course,
        time: data[0]?.reserved_time.replace(':', ''),
      })
      .catch(err => console.warn(err));

    if (status === 200) {
      router.push({
        pathname: '/reserve',
        query: { tab: 'my_book' },
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.post(
        `/teezzim/teeapi/v1/club/${router.query.id}/reservation/confirm`,
        { id: userInfo[0]?.id, password: userInfo[0]?.password },
      );
      const res = await data?.data;
      setReserveDetailData(res?.data);
    };

    fetchData();
  }, [router?.query?.id, userInfo]);

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
        <p>{reserveDetailData?.golf_club?.name}</p>
        <button
          onClick={() =>
            router.push(`/reserve/info/${reserveDetailData?.golf_club?.id}`)
          }
          className={styles.sideBtn}
          style={{ width: '90px' }}
        >
          골프장 정보
        </button>
      </div>

      <div className={styles.reserveContainer}>
        <ReserveDetail detail={reserveDetailData.data} />
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
              window.open(`${reserveDetailData?.golf_club?.homepage}`)
            }
          >
            {reserveDetailData?.golf_club?.name} [바로가기]
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
                    {reserveDetailData.status === 'okay'
                      ? reserveDetailData?.data[0]?.reserved_date
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
                    {reserveDetailData.status === 'okay'
                      ? reserveDetailData?.data[0]?.reserved_time
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
                    {reserveDetailData.status === 'okay'
                      ? `${reserveDetailData?.data[0]?.reserved_course} 코스`
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
