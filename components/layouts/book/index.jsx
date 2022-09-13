import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState, useEffect, useCallback } from 'react';
import useStores from '@/stores/useStores';
import {
  getPrevYearMonth,
  getNextYearMonth,
  getTodayKST,
} from '@/lib/DateUtils';
import axios from 'axios';
import Calender from '@/components/layouts/book/Calendar';
import Filter from '@/components/layouts/book/Filter';
import Panel from '@/components/layouts/book/Panel';
import MiniPanel from '@/components/layouts/book/MiniPanel';

import BookContainer from '@/components/layouts/book/BookContainer';
import WaitContainer from '@/components/layouts/book/WaitContainer';
import AlarmContainer from '@/components/layouts/book/AlarmContainer';

export default function Book() {
  const router = useRouter();

  const {
    query: { subTab = 'tabContent01', container = 'book', ...others },
  } = router;
  const { teeScheduleStore, authStore, loadStore, toastStore, panelStore } = useStores();

  /** Calender Component */
  const [date, setDate] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [cachedSchedule, setCacheSchedule] = useState([]);
  const [uncachedClubList, setUncachedClubList] = useState([]);
  

  const now = getTodayKST(); // 오늘 날짜 객체
  const [tyear, tmonth, tdate] = [
    now.getFullYear(),
    now.getMonth() + 1, // returns 0 - 11
    now.getDate(),
  ]; // 오늘 기준의 연도, 달, 날
  const today = `${tyear}-${tmonth < 10 ? '0' + tmonth : tmonth}-${
    tdate < 10 ? '0' + tdate : tdate
  }`; // YYYY-MM-DD 형식으로 출력한 오늘 날짜
  const [yearMonth, setYearMonth] = useState({ year: tyear, month: tmonth }); // 달력에 출력할
  const yearMonthStr = useMemo(
    () =>
      `${yearMonth.year}-${
        yearMonth.month < 10 ? '0' + yearMonth.month : yearMonth.month
      }`,
    [yearMonth],
  );

  /** Date Select */
  const handleDate = async (e, clubList) => {
    const { dateTime } = e.target;
    setDate(dateTime);
    teeScheduleStore.setDate(dateTime);
    // console.log(dateTime);
    // if (container !== 'book') return;
    if (container === 'book') {
      // let checkedTeeList = [];
      // for (const item of panelStore._checkedTeeList) checkedTeeList.push( JSON.parse(item).eng );
      // const data = { date: dateTime, club_list: checkedTeeList.join(',') };
      const data = { date: dateTime, club_list: clubList.join(',') };
      const params = { command: 'resquestSearchTime', data: JSON.stringify(data) }; // TODO 여기 오타 어쩌지...?
      if (window.BRIDGE && window.BRIDGE.globalMethod) {
        window.BRIDGE.globalMethod(JSON.stringify(params));
      } else if (window.webkit && window.webkit.messageHandlers ) {
        const payload = JSON.stringify({
          command: 'requestSearchTime',
          data: JSON.stringify(data)
        });
        window.webkit.messageHandlers.globalMethod.postMessage(payload);
      }
    }
  };

  const getDayScadules = async function () {
    const dateTime = teeScheduleStore._date;
    loadStore.reset();
    loadStore.setLoading(true);
    const {
      status,
      data: { resultCode, message, data },
    } = await axios.get('/teezzim/teeapi/v1/schedule/filter', {
      params: {
        dates: dateTime,
        device_id:authStore.deviceId,
        clubId: panelStore.checkedKeys.join(','),
      },
    });

    loadStore.setLoading(false);

    if (status === 200) {
      if (resultCode === 1) {
        const nameMap = panelStore.checkedKeys.reduce(
          (acc, id) => ({ ...acc, [panelStore.teeListMap?.[id]?.name]: id }),
          {},
        );
        // console.log("@@@", data);
        const daySchedule = data?.[dateTime]
          ? Object.entries(data[dateTime]).reduce(
              (acc, [course, schedules]) => {
                let nextAcc = acc;
                for (let [hour, scheduleList] of Object.entries(schedules)) {
                  for (let schedule of scheduleList) {
                    const { golf_club_name } = schedule;
                    if (!nextAcc?.[nameMap?.[golf_club_name]]) continue;
                    // 여기에서 SavedReservation Data로 필터링
                    // nextAcc.nameMap[golf_club_name];
                    // teeScheduleStore.reservedSchedules[golf]
                    nextAcc[nameMap[golf_club_name]] = {
                      ...(nextAcc[nameMap[golf_club_name]] || {}),
                      [course]: [
                        ...(nextAcc[nameMap[golf_club_name]]?.[course] || []),
                        { ...schedule, hour },
                      ],
                    };
                  }
                }
                return nextAcc;
              },
              panelStore.checkedKeys.reduce(
                (acc, v) => ({ ...acc, [v]: {} }),
                {},
              ),
            )
          : panelStore.checkedKeys.reduce(
              (acc, v) => ({ ...acc, [v]: {} }),
              {},
            );

        // console.log(daySchedule);
        teeScheduleStore.setTeeSchedules(daySchedule);
      } else console.warn(message);
    } else {
      loadStore.setError(true);
      console.warn(`error code: ${status}`);
    }
  }

  const handleSelectContainer = useCallback(async(e) => {
    setCacheSchedule([]); setUncachedClubList([]);
    const selectedLength = panelStore.checkedTeeList.size;
    const { id } = e.target;
    if (!id) return;
    if (id !== 'book' && id !== 'wait' && id !== 'alarm') return;

    teeScheduleStore.setDate(0);
    if (id === 'wait' || id === 'alarm' ) { // 준비중 팝업 호출
      const params = { command: 'showPopupWait', data: ''};
      // if (window.BRIDGE && window.BRIDGE.globalMethod) {
      //   window.BRIDGE.globalMethod(JSON.stringify(params));
      // } else if (window.webkit && window.webkit.messageHandlers ) {
      //   window.webkit.messageHandlers.globalMethod.postMessage(JSON.stringify(params));
      // }
      // return;
    }

    if (selectedLength <= 0) {
      toastStore.setMessage('골프장을 1개 이상 선택해 주세요.');
      toastStore.setHidden(false);
      return;
    }

    if (selectedLength > 20) {
      const obj = id === 'wait' ? '대기' : id === 'alarm' ? '오픈알림' : '';
      toastStore.setMessage(
        <>
          20개 이하의 골프장에서만
          <br /> 예약{obj}을 할 수 있습니다.
        </>,
      );
      toastStore.setHidden(false);
      return;
    }

    // checkList 저장 코드
    let saveData = [];
    for (const saveItem of panelStore.checkedTeeList){
      const saveCtl = JSON.parse(saveItem);
      if (saveCtl.state !== 1 || saveCtl.state !== 2){
        saveData.push({ club: saveCtl.eng, club_id: saveCtl.id });
      }
    }
    window.localStorage.setItem('checkList', JSON.stringify(saveData));
    window.teeSearchFinished = function () {
      router.push({
        href: '/home',
        query: {
          ...others,
          subTab: 'tabContent01',
          container: id,
          prev: 'home',
        },
      });
      panelStore.setPanelHidden(true);
    }

    // cache 스케쥴 조회
    const clubList = panelStore.filterCheckedTeeList.map(tee=>tee.id);
    const res = await axios.post('/teezzim/teeapi/v1/schedule/date/cache',{
      time: "60",
      club_list: clubList
    });

    if( res.data.empty.length < 1 && res.data.data.length > 0 ) {
      console.log('[LOG][CASE] 캐시가 모두 있는 경우');
      setCacheSchedule(res.data.data); setUncachedClubList([]);
      const cacheSchedule = res.data.data.reduce((acc, {date, count, club })=> ({
        ...acc,
        [date]: {
          club: club,
          count: count
        }
      }));
      setSchedule(prevSchedule => ({
        ...prevSchedule,
        [yearMonthStr]: cacheSchedule,
      }));
      
      router.push({
        href: '/home',
        query: {
          ...others,
          subTab: 'tabContent01',
          container: id,
          prev: 'home',
        },
      });
      panelStore.setPanelHidden(true);
    } else {
      if(res.data.data.length){
        console.log('[LOG][CASE] 일부만 캐시가 있는 경우'); 
        setCacheSchedule(res.data.data); setUncachedClubList(res.data.empty);
      } else {
        console.log('[LOG][CASE] 캐시가 모두 없는 경우'); 
        setCacheSchedule([]); setUncachedClubList(res.data.empty);
      }
      if (id === 'book'){
        teeScheduleStore.setCalenderUpdate();
        const data = res.data.empty;
        // for (const item of panelStore.filterCheckedTeeList) {
        //   // const ctl = JSON.parse(item);
        //   const ctl = item;
        //   if (ctl.state !== 1 || ctl.state !== 2){
        //     data.push({ club: ctl.eng, club_id: ctl.id });
        //     const timeKey = 'search-' + ctl.id;
        //     const nowTime = (new Date()).getTime();
        //     window.localStorage.setItem(timeKey, nowTime);
        //   }
        // }
        if (window.BRIDGE && window.BRIDGE.requestSearch) {
          window.BRIDGE.requestSearch(JSON.stringify(data));
        } else if (window.webkit && window.webkit.messageHandlers ) {
          const payload = JSON.stringify({
            command: 'requestSearch',
            data: JSON.stringify(data)
          });
          window.webkit.messageHandlers.globalMethod.postMessage(payload);
        } else {
          console.warn('이 기능은 앱에서만 동작합니다.' + JSON.stringify(data));
        }
      }
    }
  });

  useEffect(() => {
    if(window){
      const params = { command: 'getDeviceId'};
      window.BRIDGE.globalMethod(JSON.stringify(params));

      window.callDeviceId = function (deviceId) {
        const { device_id } = JSON.parse(deviceId);
        authStore.setDeviceId(device_id);
      };
      // console.log("### teeSearchTimeFinished 바인딩됨");
      /** APP->WEB */
      window.teeSearchTimeFinished = function(){
        console.log("### teeSearchTimeFinished 호출됨");
        setTimeout(()=>{
          getDayScadules();
        }, 500);
      };
    }
  }, []);

  /** Panel Component */

  const renderContainer = () => {
    if (!date) return;
    switch (container) {
      case 'book':
        return <BookContainer />;
      case 'wait':
        return <WaitContainer />;
      case 'alarm':
        return <AlarmContainer />;
      default:
        return <BookContainer />;
    }
  };

  return (
    <>
      <Panel handleSelectContainer={handleSelectContainer}/>
      <div className='pt-15'></div>
      <MiniPanel />

      <div className='filter-wrap'>
        <div className='filter-container'>
          <div className='title-group'>
            <h1 className='filter-title'>
              {subTab === 'tabContent01' ? (
                <time dateTime={yearMonthStr}>
                  {yearMonth.year}년 {yearMonth.month}월
                </time>
              ) : (
                '고급필터'
              )}
            </h1>
            {subTab === 'tabContent01' && (
              <div className='date_area'>
                <button
                  type='button'
                  className='btn-mon-prev'
                  disabled={
                    tyear == yearMonth.year && tmonth === yearMonth.month
                  }
                  onClick={() => {
                    const [year, month] = getPrevYearMonth(
                      yearMonth.year,
                      yearMonth.month,
                    );
                    setYearMonth({ year, month });
                    teeScheduleStore.setCalenderUpdate();
                  }}
                >
                  <span className='offscreen'>이전달</span>
                </button>
                <button
                  type='button'
                  className='btn-mon-next'
                  onClick={() => {
                    const [year, month] = getNextYearMonth(
                      yearMonth.year,
                      yearMonth.month,
                    );
                    setYearMonth({ year, month });
                    teeScheduleStore.setCalenderUpdate();
                  }}
                >
                  <span className='offscreen'>다음달</span>
                </button>
              </div>
            )}
            <div className='tab-nav tab-basic'>
              <ul role='tablist'>
                <li
                  role='none'
                  className={subTab === 'tabContent01' ? 'is-selected' : null}
                >
                  <Link
                    href={{
                      pathname: '/home',
                      query: { subTab: 'tabContent01', container, ...others },
                    }}
                    // as='/home'
                  >
                    <a
                      id='tabNav01'
                      role='tab'
                      aria-controls='tabContent01'
                      aria-selected='false'
                    >
                      <span>달력</span>
                    </a>
                  </Link>
                </li>
                <li
                  role='none'
                  className={subTab === 'tabContent02' ? 'is-selected' : null}
                >
                  <Link
                    href={{
                      pathname: '/home',
                      query: {
                        subTab:
                          container === 'book'
                            ? 'tabContent02'
                            : 'tabContent01',
                        container,
                        ...others,
                      },
                    }}
                    // as='/home'
                  >
                    <a
                      id='tabNav02'
                      role='tab'
                      aria-controls='tabContent02'
                      aria-selected='true'
                    >
                      <span>필터</span>
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='filter-content'>
            <Calender
              hidden={subTab !== 'tabContent01'}
              date={date}
              handleDate={handleDate}
              schedule={schedule}
              cachedSchedule={cachedSchedule}
              uncachedClubList={uncachedClubList}
              setSchedule={setSchedule}
              yearMonth={yearMonthStr}
              today={today}
            />
            <Filter hidden={subTab !== 'tabContent02'} />
          </div>
        </div>
      </div>
      <div className='component-wrap time-select'>
        {!teeScheduleStore._date && (
          <div className='inner-container'>
            <div className='no-data mt-50'>
              <p className='text-main'>라운딩 희망일을 선택해 주세요.</p>
            </div>
          </div>
        )}
        {renderContainer()}
      </div>
      <style jsx>{`
        .filter-wrap {
          margin-top: 60px;
        }
        .title-group {
          margin-bottom: 8px;
          justify-content: space-between;
        }
        .component-wrap {
          padding-bottom: 65px;
        }
      `}</style>
    </>
  );
}

