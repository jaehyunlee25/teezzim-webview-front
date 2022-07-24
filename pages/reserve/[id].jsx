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
  // console.log('🚀 - userInfo', userInfo);
  const [reserveDetailData, setReserveDetailData] = useState([]);
  // console.log('🚀 - reserveDetailData', reserveDetailData);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [test, setTest] = useState({
    resultCode: 1,
    message: 'OK',
    data: [
      {
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
      },
    ],
  });
  console.log('🚀 - test', test);

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
        } else if (window.webkit && window.webkit.messageHandlers) {
          setTimeout(() => {
            window.webkit.messageHandlers.openWebMenu.postMessage(
              'MyReservation',
            );
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
          } else if (window.webkit && window.webkit.messageHandlers) {
            window.webkit.messageHandlers.saveReservationList.postMessage(
              jsonStr,
            );
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
    if (window) {
      window.getMyReserveForApi = function (jsonStr) {
        console.log('getMyReserveForApi', jsonStr); // device_id 필요
        const { device_id } = JSON.parse(jsonStr);
        axios({
          method: 'post',
          url: `/teezzim/teeapi/v1/club/reservation`,
          data: { device_id },
        })
          .then(resp => {
            console.log(resp);
            setTest(resp);
            // TODO 새로운 데이터 형식으로 뿌려줘야 함!
            /* 샘플 데이터 구조
          {
            "resultCode": 1,
            "message": "OK",
            "data": [{
                "id": "165ec3da-0ab7-11ed-a93e-0242ac11000a",
                "device_id": "9b2d40ad-0aa3-11ed-a93e-0242ac11000a",
                "golf_club_id": "28fd237b-eeca-11ec-a93e-0242ac11000a",
                "golf_course_id": "28ff717a-eeca-11ec-a93e-0242ac11000a",
                "game_date": "20220809",
                "game_time": "1234",
                "isCancel": 1,
                "created_at": "2022-07-23T18:41:58.000Z",
                "updated_at": "2022-07-23T18:41:58.000Z",
                "createdAt": "2022-07-23T18:41:58.000Z",
                "updatedAt": "2022-07-23T18:41:58.000Z",
                "Device": {
                    "id": "9b2d40ad-0aa3-11ed-a93e-0242ac11000a",
                    "token": "fEGot2k1Sh2raE28s2pBoY:APA91bHDIdB-cBkyiYXC-4Ckyn5ZhZHVyHfLJ9V1Lewm9HieEKx78JoYmQF-VzPseqy1edlYc20cbYjosWYJ6zrV4qMNETSXAMYowPwAkSpaVDzBgWiwbJYso28qPSU1H08LgCN3Dymz",
                    "type": "android",
                    "created_at": "2022-07-23T16:22:31.000Z",
                    "updated_at": "2022-07-23T16:22:31.000Z"
                },
                "GolfClub": {
                    "id": "28fd237b-eeca-11ec-a93e-0242ac11000a",
                    "name": "백제",
                    "address": "충청남도 부여군 은산면 충절로 3734-82",
                    "phone": "041-830-0700",
                    "area": "충청도",
                    "email": "baekjecc0700@naver.com",
                    "homepage": "https://www.baekjecc.com/index.asp",
                    "corp_reg_number": "307-81-06923",
                    "description": "백제컨트리클럽은 칠갑산 자락에 감싸 안겨 천혜의 지형 조건과 자연 상태를 코스에 담아내기 위해 친환경적인 시공 방법으로 골프장을 조성하였고, 2008년 개장한 이후 끊임없는 변화를 추구하며 항상 새로운 모습을 보여드리기 위해 노력해왔습니다.\n\n또한, 친환경적인 골프장으로서 현재 금강유역환경청, 고운식물원과 협약하여 천연기념물과 멸종위기 종인 동, 식물의 복원사업을 추진 중입니다.\n\n2008년 대중제 18홀 규모로 개장 하였고 8년간 정성을 다해 준비하여 2016년 10월 11일 한성코스 9홀을 추가로 오픈하여 규모 27홀의 대중제 골프장으로 새롭게 단장하였습니다.\n\n백제컨트리클럽은 모두가 즐길 수 있는 코스 레이아웃과 풍광이 주는 감동, 삼림욕을 즐기는 듯한 청량감에 좋은 사람과 편안한 휴식을 하시기에 최적의 골프장이라 자신합니다.\n\n최고의 골프장으로 발돋움 할 수 있도록 끊임없이 배우고 받아들이고 노력하겠습니다.\n\n백제 컨트리클럽을 방문하여 주셔서 감사합니다."
                },
                "GolfCourse": {
                    "id": "28ff717a-eeca-11ec-a93e-0242ac11000a",
                    "golf_club_id": "28fd237b-eeca-11ec-a93e-0242ac11000a",
                    "name": "웅진",
                    "description": "9홀",
                    "createdAt": "2022-06-18T05:47:50.000Z",
                    "updatedAt": "2022-06-18T05:47:50.000Z",
                    "GolfClubId": "28fd237b-eeca-11ec-a93e-0242ac11000a"
                }
              },
            ],
          }
          */
          })
          .catch(err => {
            console.log(err);
          });
      };
    }
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
        {/* <p>{reserveDetailData?.golf_club?.name}</p> */}
        <p>{test?.data[0]?.GolfClub?.name}</p>
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
        {/* <ReserveDetail detail={reserveDetailData.data} /> */}
        <ReserveDetail detail={test.data} />
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
              window.open(`${test?.data[0]?.GolfClub?.homepage}`)
            }
          >
            {/* {reserveDetailData?.golf_club?.name} [바로가기] */}
            {test?.data[0]?.GolfClub?.name} [바로가기]
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
                    {/* {reserveDetailData.status === 'okay'
                      ? reserveDetailData?.data[0]?.reserved_date
                      : null} */}
                    {test.resultCode === 1 ? test?.data[0]?.game_date : null}
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
                      ? reserveDetailData?.data[0]?.reserved_time
                      : null} */}
                    {test.resultCode === 1 ? test?.data[0]?.game_time : null}
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
                      ? `${reserveDetailData?.data[0]?.reserved_course} 코스`
                      : null} */}
                    {test.resultCode === 1
                      ? test?.data[0]?.GolfCourse?.name
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
