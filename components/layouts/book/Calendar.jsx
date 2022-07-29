import { getTotalDate, getOffsetFirstDay } from '@/lib/DateUtils';
import useStores from '@/stores/useStores';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';

const Calendar = observer(
  ({ date, handleDate, yearMonth, today, ...others }) => {
    const { panelStore, teeScheduleStore } = useStores();
    const [schedule, setSchedule] = useState({});
    const day = useMemo(() => getOffsetFirstDay(yearMonth), [yearMonth]);
    const dates = useMemo(() => {
      const [year, month] = yearMonth.split('-').map(v => Number(v));
      return Array.from({ length: getTotalDate(year, month) }, (_, i) =>
        i + 1 < 10 ? `${yearMonth}-0${i + 1}` : `${yearMonth}-${i + 1}`,
      );
    }, [yearMonth]);

    const mountRef = useRef(true);
    const getSchedule = useCallback(async () => {
      if (!mountRef.current || !teeScheduleStore._calenderUpdate) return;
      const checkedTeeList = [...panelStore._checkedTeeList].map(v =>
        JSON.parse(v),
      );
      axios.interceptors.response.use(
        res => {
          console.log(res);
          if (res.data.data?.length === 0) {
            /** WEB->APP requestSearch 요청 */
            const params = {
              club: res.config.params.eng,
              club_id: res.config.params.club,
              command: 'search', // 고정 문자열
            };
            const timeKey = 'search-' + params.club_id;
            let savedTime = window.localStorage.getItem(timeKey);
            // console.log("###", savedTime);
            if( savedTime ){
              savedTime = Number(savedTime);
              if( savedTime + 5000 > (new Date()).getTime() ) {
                return res;
              }
            }
            const nowTime = (new Date()).getTime();
            window.localStorage.setItem(timeKey, nowTime);
            // console.log("###", nowTime);
            if (window.BRIDGE && window.BRIDGE.requestSearch) {
              window.BRIDGE.requestSearch(JSON.stringify(params));
            } else if (window.webkit && window.webkit.messageHandlers) {
              window.webkit.messageHandlers.requestSearch.postMessage(
                JSON.stringify(params),
              );
            } else {
              alert(JSON.stringify(params));
            }
          }
          return res;

          // 앱에서 추가 요청 하거나 -> 앱에서 크롤러 함수 진행 완료 상황을 받아서 재요청 해야할듯
          // return axios.request(config)
        },
        err => Promise.reject(err),
      );

      const res = await Promise.all(
        checkedTeeList.map(({ id, eng }) =>
          axios.get('/teezzim/teeapi/v1/schedule', {
            params: { date: `${yearMonth}-01`, club: id, eng },
          }),
        ),
      ).catch(err => console.log(err));

      // console.log(res);
      let curSchedule = {};

      res.forEach(v => {
        const {
          data: { resultCode = 1, message = '', data = [] },
        } = v;
        // console.log(resultCode, message, data);
        if (resultCode === 1) {
          // yearMonth: yyyy-mm, date: yyyy-mm-dd
          curSchedule = data.reduce(
            (acc, { date, count }) => ({
              ...acc,
              [date]: acc?.[date] ? acc[date] + count : count,
            }),
            curSchedule,
          );
        } else {
          console.warn(message);
        }
      });

      setSchedule(prevSchedule => ({
        ...prevSchedule,
        [yearMonth]: curSchedule,
      }));
      teeScheduleStore.setCalenderUpdate(false);
    }, [yearMonth, setSchedule, panelStore._checkedTeeList, teeScheduleStore]);

    useEffect(() => {
      mountRef.current = true;
      if (
        teeScheduleStore._calenderUpdate &&
        panelStore._checkedTeeList.size > 0 &&
        panelStore._panelHidden
      )
        // getSchedule();
      return () => {
        mountRef.current = false;
      };
    }, [
      teeScheduleStore._calenderUpdate,
      getSchedule,
      yearMonth,
      panelStore._checkedTeeList,
      panelStore._panelHidden,
    ]);

    useEffect(() => {
      if(window){
        /** APP->WEB */
        window.teeSearchFinished = function () {
          getSchedule();
        };
      }
    }, []);

    return (
      <>
        <div
          id='tabContent01'
          role='tabpanel'
          aria-labelledby='tabNav01'
          aria-hidden='false'
          {...others}
        >
          <div className='calendar'>
            <div className='day-of-week'>
              <div>일</div>
              <div>월</div>
              <div>화</div>
              <div>수</div>
              <div>목</div>
              <div>금</div>
              <div>토</div>
            </div>
            <div className='date-grid'>
              {Array.from({ length: day }, (_, i) => (
                <DateButton key={i} />
              ))}
              {dates?.map(v => (
                <DateButton
                  key={v}
                  className={`${
                    v === today ? 'today' : v < today ? 'prev-mon' : ''
                  }${v === date ? ' on' : ' '}`}
                  date={v}
                  count={schedule?.[yearMonth]?.[v] ?? 0}
                  onClick={v >= today ? handleDate : null}
                />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  },
);

export default Calendar;

const DateButton = ({ date, count, className, onClick, ...others }) => {
  const dateText = date?.split('-')[2];
  const day = new Date(date).getUTCDay();
  const classes = className ?? '';
  return (
    <>
      <button className={day === 0 ? 'sunday ' + classes : classes} {...others}>
        <time dateTime={date ?? ''} onClick={onClick}>
          {dateText ?? <>&nbsp;</>}
        </time>
        <p className='number'>
          {count ? (
            <>
              <strong>{count}</strong>T
            </>
          ) : (
            <>&nbsp;</>
          )}
        </p>
      </button>
      <style jsx>{`
        button:hover,
        button:focus {
          background-color: initial;
          color: initial;
          border-radius: 0px;
        }
        button:hover .number,
        button:focus .number {
          color: initial;
        }

        button.on {
          background-color: var(--brand-primary);
          color: var(--neutrals-white);
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};
