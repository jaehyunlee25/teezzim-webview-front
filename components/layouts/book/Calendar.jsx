import { getTotalDate, getOffsetFirstDay } from '@/lib/DateUtils';
import useStores from '@/stores/useStores';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useCallback, useRef } from 'react';
import { toJS } from 'mobx';

const Calendar = observer(
  ({ date, handleDate, schedule, setSchedule, successList, successClubList, setSuccessClubList, yearMonth, today, ...others }) => {
    const { panelStore, authStore, teeScheduleStore } = useStores();

    const day = useMemo(() => getOffsetFirstDay(yearMonth), [yearMonth]);
    const dates = useMemo(() => {
      const [year, month] = yearMonth.split('-').map(v => Number(v));
      return Array.from({ length: getTotalDate(year, month) }, (_, i) =>
        i + 1 < 10 ? `${yearMonth}-0${i + 1}` : `${yearMonth}-${i + 1}`,
      );
    }, [yearMonth]);
    const storage = globalThis?.sessionStorage;
    const mountRef = useRef(true);
    
    const getSchedule = useCallback(async (scheduleList) => {
      if (!mountRef.current) return;

      let curSchedule = {};

      if (scheduleList.length) {
        curSchedule = scheduleList.reduce((acc, { date, count, club }) => ({
          ...acc,
          [date]: {
            club: acc?.[date] ? [...acc[date].club, club] : club,
            count: acc?.[date] ? acc[date].count + count : count,
          }
        }),{});
      }

      console.log('getSchedule 실행됨');
      console.log('scheduleList',toJS(scheduleList));

      setSchedule(prevSchedule => ({
        ...prevSchedule,
        [yearMonth]: curSchedule,
      }));
      teeScheduleStore.setCalenderUpdate(false);
    }, [yearMonth, setSchedule, teeScheduleStore]);

    useEffect(() => {
      mountRef.current = true;
      if (
        // teeScheduleStore._calenderUpdate &&
        panelStore._checkedTeeList.size > 0 &&
        panelStore._panelHidden
      ) {
        getSchedule(successList);
      }
      return () => {
        mountRef.current = false;
      };
    }, [yearMonth, panelStore._panelHidden, panelStore._checkedTeeList.size, getSchedule, successList]);

    useEffect(() => {
      if (window) {
        const prevPath = storage.getItem('prevPath');
        if (prevPath) {
          if (prevPath.includes('/reserve/create')) {
            setSuccessClubList(successClubList);
          }
        }
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
              <div className='sunday'>일</div>
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
                  className={`${v === today ? 'today' : v < today ? 'prev-mon' : ''
                    }${v === date ? 'selected' : ' '} ${schedule?.[yearMonth]?.[v]?.count ? '' : 'prev-mon'}`}
                  date={v}
                  clubList={schedule?.[yearMonth]?.[v]?.club ?? []}
                  count={schedule?.[yearMonth]?.[v]?.count ?? 0}
                  onClick={v >= today ? handleDate : ()=>{}}
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

const DateButton = ({ date, count, className, onClick, clubList, ...others }) => {
  const classes = className ?? '';
  const dateText = classes === 'selected' ? `: ${date?.split('-')[2]}` : date?.split('-')[2];
  const day = new Date(date).getUTCDay();

  return (
    <>
      <button className={day === 0 ? 'sunday ' + classes : classes} {...others} onTouchEnd={count ? () => onClick(date ?? '', clubList) : (null)}>
        <time dateTime={date ?? ''}>
          {dateText ?? <>&nbsp;</>}
        </time>
        <p className='number'>
          {!classes.includes('prev-mon') && count ? (
            <>
              <strong>{count}</strong>G
            </>
          ) : (
            <>&nbsp;</>
          )}
        </p>
      </button>
      {/* <style jsx>{`
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
          background-color: var(--naturals-black2);
          color: var(--neutrals-white);
          border-radius: 8px;
        }
      `}</style> */}
    </>
  );
};

