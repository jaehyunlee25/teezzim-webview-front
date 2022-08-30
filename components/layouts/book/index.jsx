import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState, useEffect } from 'react';
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
import PopUp from '@/components/common/PopUp';

export default function Book() {
  const router = useRouter();

  const {
    query: { subTab = 'tabContent01', container = 'book', ...others },
  } = router;
  const { teeScheduleStore, loadStore, panelStore } = useStores();

  /** Calender Component */
  const [date, setDate] = useState(null);

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
    const availableClubList = clubList.split(',');
    const { dateTime } = e.target;
    setDate(dateTime);
    teeScheduleStore.setDate(dateTime);
    // console.log(dateTime);
    // if (container !== 'book') return;
    if (container === 'book') {
      // let checkedTeeList = [];
      // for (const item of panelStore._checkedTeeList) checkedTeeList.push( JSON.parse(item).eng );
      // const data = { date: dateTime, club_list: checkedTeeList.join(',') };
      const data = { date: dateTime, club_list: availableClubList.join(',') };
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

  useEffect(() => {
    if(window){
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
      <Panel />
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
