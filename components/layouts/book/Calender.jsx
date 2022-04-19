import { getTotalDate, getOffsetFirstDay } from '@/lib/DateUtils';
import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';

const Calender = ({ handleDate, yearMonth, today, ...others }) => {
  const [schedule, setSchedule] = useState({});
  const day = useMemo(() => getOffsetFirstDay(yearMonth), [yearMonth]);
  const dates = useMemo(() => {
    const [year, month] = yearMonth.split('-');
    return Array.from(
      { length: getTotalDate(Number(year), Number(month)) },
      (_, i) =>
        i + 1 < 10 ? `${yearMonth}-0${i + 1}` : `${yearMonth}-${i + 1}`,
    );
  }, [yearMonth]);

  useEffect(() => {
    const getSchedule = async () => {
      const {
        status,
        data: { message, data },
      } = await axios.get('/teezzim/teeapi/v1/schedule', {
        params: { date: today },
      });
      if (message === 'OK') {
        // console.log(data);
        setSchedule({
          ...schedule,
          [yearMonth]: data.reduce(
            (acc, { date, count }) => ({ ...acc, [date]: count }),
            {},
          ),
        });
        // console.log(schedule);
      } else {
        console.warn(`error code: ${status}`);
      }
    };
    if (!schedule?.[yearMonth]) getSchedule();
  }, [yearMonth, today, schedule, setSchedule]);
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
                date={v}
                count={schedule?.[yearMonth]?.[v] ?? 0}
                className={v < today ? 'prev-mon' : v === today ? 'today' : ''}
                disabled={v < today}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calender;

const DateButton = ({ date, count, className, ...others }) => {
  const dateText = date?.split('-')[2];
  const day = new Date(date).getUTCDay();
  const classes = className ?? '';
  return (
    <>
      <button className={day === 0 ? 'sunday ' + classes : classes} {...others}>
        <time dateTime={date ?? ''}>{dateText ?? <>&nbsp;</>}</time>
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
