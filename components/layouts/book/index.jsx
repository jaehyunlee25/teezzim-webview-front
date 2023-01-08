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
  // const [successList, setSuccessList] = useState([]);
  const [successClubList, setSuccessClubList] = useState([]);
  const [containerID, setContainerID] = useState('');

  const now = getTodayKST(); // 오늘 날짜 객체
  const [tyear, tmonth, tdate] = [
    now.getFullYear(),
    now.getMonth() + 1, // returns 0 - 11
    now.getDate(),
  ]; // 오늘 기준의 연도, 달, 날
  const today = `${tyear}-${tmonth < 10 ? '0' + tmonth : tmonth}-${tdate < 10 ? '0' + tdate : tdate
    }`; // YYYY-MM-DD 형식으로 출력한 오늘 날짜
  const [yearMonth, setYearMonth] = useState({ year: tyear, month: tmonth }); // 달력에 출력할
  const yearMonthStr = useMemo(
    () =>
      `${yearMonth.year}-${yearMonth.month < 10 ? '0' + yearMonth.month : yearMonth.month
      }`,
    [yearMonth],
  );

  /** Date Select */
  const handleDate = async (dateTime, clubList) => {
    // const { dateTime } = e.target;
    setDate(dateTime);
    teeScheduleStore.setDate(dateTime);
    teeScheduleStore.cleanTeeSchedules();
    setSuccessClubList([]);
    teeScheduleStore.setSuccessClubList([]);
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
      } else if (window.webkit && window.webkit.messageHandlers) {
        const payload = JSON.stringify({
          command: 'requestSearchTime',
          data: JSON.stringify(data)
        });
        window.webkit.messageHandlers.globalMethod.postMessage(payload);
      }
      setSuccessClubList(teeScheduleStore.successClubList);
    }
  };

  const handleSelectContainer = useCallback(async (e) => {
    setSchedule({});
    setSuccessClubList([]);
    teeScheduleStore.setSuccessClubList([]);
    teeScheduleStore.setSuccessList([]);

    const selectedLength = panelStore.checkedTeeList.size;
    const { id } = e.target;
    if (!id) return;
    if (id !== 'book' && id !== 'wait' && id !== 'alarm') return;
    setContainerID(id);

    teeScheduleStore.setDate(0);
    if (id === 'wait' || id === 'alarm') { // 준비중 팝업 호출
      const params = { command: 'showPopupWait', data: '' };
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
    for (const saveItem of panelStore.checkedTeeList) {
      const saveCtl = JSON.parse(saveItem);
      if (saveCtl.state !== 1 || saveCtl.state !== 2) {
        saveData.push({ club: saveCtl.eng, club_id: saveCtl.id });
      }
    }
    window.localStorage.setItem('checkList', JSON.stringify(saveData));

    // cache 스케쥴 조회
    if (id === 'book') {
      let data = [];
      for (const item of panelStore.filterCheckedTeeList) {
        const ctl = item;
        if (ctl.state !== 1 || ctl.state !== 2) {
          data.push({ club: ctl.eng, club_id: ctl.id });
          const timeKey = 'search-' + ctl.id;
          const nowTime = (new Date()).getTime();
          window.localStorage.setItem(timeKey, nowTime);
        }
      }
      if (window.BRIDGE && window.BRIDGE.requestSearch) {
        window.BRIDGE.requestSearch(JSON.stringify(data));
      } else if (window.webkit && window.webkit.messageHandlers) {
        const payload = JSON.stringify({
          command: 'requestSearch',
          data: JSON.stringify(data),
        });
        window.webkit.messageHandlers.globalMethod.postMessage(payload);
      } else {
        console.warn('이 기능은 앱에서만 동작합니다.' + JSON.stringify(data));
      }
    }
  });

  useEffect(() => {
    if (window) {
      const params = { command: 'getDeviceId' };

      if (window.BRIDGE && window.BRIDGE.globalMethod) window.BRIDGE.globalMethod(JSON.stringify(params));

      window.callDeviceId = function (deviceId) {
        const { device_id } = JSON.parse(deviceId);
        authStore.setDeviceId(device_id);
      };

      window.teeSearchFinished = function (data) {
        router.push({
          href: '/home',
          query: {
            ...others,
            subTab: 'tabContent01',
            container: containerID,
            prev: 'home',
          },
        });
        panelStore.setPanelHidden(true);
        console.log("### teeSearchFinished 호출됨", data);
        ///----
        const jarr = JSON.parse(data);
        let scheduleList = [];
        let clubList = [];
        for (const info of jarr) {
          if (!clubList.includes(info.club)) clubList.push(info.club);
          for (const dt of info.content) {
            const idx = scheduleList.findIndex((sItem) => sItem.date == dt);
            if (idx < 0) {
              scheduleList.push({ date: dt, count: 1, club: [info.club] });
            } else { // 이미 해당 날짜가 있으면
              // const idx2 = scheduleList[idx].club.findIndex((c) => c == info.club);
              if (scheduleList[idx].club.findIndex((c) => c == info.club) < 0) {
                scheduleList[idx].club.push(info.club);
                scheduleList[idx].count = scheduleList[idx].club.length;
              }
            }
          }
        }
        // console.log(clubList)
        // console.log(scheduleList);
        setSuccessClubList(successClubList.concat(clubList));
        teeScheduleStore.setSuccessClubList(teeScheduleStore.successClubList.concat(clubList));
        teeScheduleStore.setSuccessList(teeScheduleStore.successList.concat(scheduleList));
        ///----
        // setSuccessList(data);
      }

      // console.log("### teeSearchTimeFinished 바인딩됨");
      /** APP->WEB */
      window.teeSearchTimeFinished = function (data) {
        router.push({
          href: '/home',
          query: {
            ...others,
            subTab: 'tabContent01',
            container: containerID,
            prev: 'home',
          },
        });
        panelStore.setPanelHidden(true);
        // console.log("### teeSearchTimeFinished 호출됨", data);
        const jarr = JSON.parse(data);
        const jarrClubList = jarr.map(tee => tee.club);

        setSuccessClubList(successClubList.concat(jarrClubList));
        teeScheduleStore.setSuccessClubList(teeScheduleStore.successClubList.concat(jarrClubList));

        let daySchedule = {};
        for (const info of jarr) {
          daySchedule[info.club_id] = {};
          for (const row of info.content) {
            row.hour = row.time.substring(0, 2);
            row.time = row.time + ":00";
            if (daySchedule[info.club_id].hasOwnProperty(row.golf_course_name)) {
              daySchedule[info.club_id][row.golf_course_name].push(row);
            } else { // 중복된 코스가 없으면
              daySchedule[info.club_id][row.golf_course_name] = [row];
            }
          }
        }
        teeScheduleStore.setTeeSchedules(Object.assign(teeScheduleStore.teeSchedules, daySchedule));
        // getDayScadules(clubList);
      };
    }
  }, [schedule]);

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
      <Panel handleSelectContainer={handleSelectContainer} />
      <div className='pt-15'></div>
      <MiniPanel successClubList={teeScheduleStore.successClubList} />

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
                    setDate(null);
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
                    setDate(null);
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
              // cachedSchedule={cachedSchedule}
              // uncachedClubList={uncachedClubList}
              successList={teeScheduleStore.successList}
              successClubList={teeScheduleStore.successClubList}
              setSuccessClubList={setSuccessClubList}
              // setSuccessList={setSuccessList}
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

