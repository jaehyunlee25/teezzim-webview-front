import { getTotalDate, getOffsetFirstDay } from '@/lib/DateUtils';
import useStores from '@/stores/useStores';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useCallback, useRef } from 'react';

const Calendar = observer(
  ({ date, handleDate, schedule, setSchedule, successList, yearMonth, today, ...others }) => {
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

      // const clubList = panelStore.filterCheckedTeeList.map(tee=>tee.id);
      // const res = await axios.post('/teezzim/teeapi/v1/schedule/date', {
      //   device_id: authStore.deviceId,
      //   club_list: club_list ? club_list.split(',') : clubList,
      // }).catch(err => console.log(err));
      
      let curSchedule = {};

      if(scheduleList.length){
        curSchedule = scheduleList.reduce((acc, {date, count, club })=> ({
          ...acc,
          [date]: {
            club: club,
            count: count
          }
        }));
      }

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
      if(window){
        const prevPath = storage.getItem('prevPath');
        if(prevPath){
          if(prevPath.includes('/reserve/create')){
            teeScheduleStore.setDate(0);
            teeScheduleStore.setCalenderUpdate();
            // const ctl = Array.from(panelStore.checkedTeeList);
            let data = [];
            for (const item of panelStore.filterCheckedTeeList) {
              // const ctl = JSON.parse(item);
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
                data: JSON.stringify(data)
              });
              window.webkit.messageHandlers.globalMethod.postMessage(payload);
            } else {
              console.warn('이 기능은 앱에서만 동작합니다.' + JSON.stringify(data));
            }
            // window.teeSearchFinished = function (clubList) {
            //   console.log("### teeSearchFinished 호출됨 3");
            //   getSchedule(clubList);
            // }
          }
        } 
        // console.log("### teeSearchFinished 바인딩됨");
        /** APP->WEB */
        // window.teeSearchFinished = function (clubList) {
        //   console.log("### teeSearchFinished 호출됨 1");
        //   getSchedule(clubList);
        // };
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
                  className={`${
                    v === today ? 'today' : v < today ? 'prev-mon' : ''
                    }${v === date ? 'selected' : ' '} ${schedule?.[yearMonth]?.[v]?.count ? '' : 'prev-mon'}`}
                  date={v}
                  clubList ={schedule?.[yearMonth]?.[v]?.club ?? []}
                  count={schedule?.[yearMonth]?.[v]?.count ?? 0}
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

const DateButton = ({ date, count, className, onClick, clubList, ...others }) => {
  const classes = className ?? '';
  const dateText = classes === 'selected'? `: ${date?.split('-')[2]}`:date?.split('-')[2];
  const day = new Date(date).getUTCDay();
  return (
    <>
      <button className={day === 0 ? 'sunday ' + classes : classes} {...others}>
        <time dateTime={date ?? ''} onClick={count ? (e)=>onClick(e, clubList): null}>
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

