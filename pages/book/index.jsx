import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import useStores from '@/stores/useStores';
import {
  getPrevYearMonth,
  getNextYearMonth,
  getTodayKST,
} from '@/lib/DateUtils';
import axios from 'axios';
import Calender from '@/components/layouts/book/Calender';
import Filter from '@/components/layouts/book/Filter';
import BookContainer from '@/components/layouts/book/BookContainer';

export default function Book() {
  const router = useRouter();
  const { teeScheduleStore, loadStore } = useStores();
  const {
    query: { tab = 'tabContent01', container = 'Book' },
  } = router;
  const [date, setDate] = useState(null);
  const now = getTodayKST();

  const [tyear, tmonth, tdate] = [
    now.getFullYear(),
    now.getMonth() + 1, // returns 0 - 11
    now.getDate(),
  ];
  const today = `${tyear}-${tmonth < 10 ? '0' + tmonth : tmonth}-${
    tdate < 10 ? '0' + tdate : tdate
  }`;

  const [yearMonth, setYearMonth] = useState({ year: tyear, month: tmonth });
  const yearMonthStr = useMemo(
    () =>
      `${yearMonth.year}-${
        yearMonth.month < 10 ? '0' + yearMonth.month : yearMonth.month
      }`,
    [yearMonth],
  );
  const handleDate = async e => {
    const { dateTime } = e.target;
    setDate(dateTime);
    console.log(dateTime);
    loadStore.reset();
    loadStore.setLoading(true);
    const {
      status,
      data: { resultCode, message, data },
    } = await axios.get('/teezzim/teeapi/v1/schedule/show', {
      params: { date: dateTime },
    });
    loadStore.setLoading(false);
    if (status === 200) {
      if (resultCode === 1) {
        console.log(data);
        teeScheduleStore.setTeeScheduleList(data);
      } else console.warn(message);
    } else {
      loadStore.setError(true);
      console.warn(`error code: ${status}`);
    }
  };

  const renderContainer = () => {
    if (!date) return;
    switch (container) {
      case 'Book':
        return <BookContainer />;
      case 'Wait':
        return;
      case 'Alarm':
        return;
      default:
        return <BookContainer />;
    }
  };
  return (
    <>
      <div className='filter-wrap'>
        <div className='filter-container'>
          <div className='title-group'>
            <h1 className='filter-title'>
              {tab === 'tabContent01' ? (
                <time dateTime={yearMonthStr}>
                  {yearMonth.year}년 {yearMonth.month}월
                </time>
              ) : (
                '고급필터'
              )}
            </h1>
            {tab === 'tabContent01' && (
              <div className='date_area'>
                <button
                  type='button'
                  className='btn-mon-prev'
                  disabled={tmonth === yearMonth.month}
                  onClick={() => {
                    const [year, month] = getPrevYearMonth(
                      yearMonth.year,
                      yearMonth.month,
                    );
                    setYearMonth({ year, month });
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
                  className={tab === 'tabContent01' ? 'is-selected' : null}
                >
                  <Link
                    href={{
                      pathname: '/book',
                      query: { tab: 'tabContent01', container },
                    }}
                    as='/book'
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
                  className={tab === 'tabContent02' ? 'is-selected' : null}
                >
                  <Link
                    href={{
                      pathname: '/book',
                      query: {
                        tab:
                          container === 'Book'
                            ? 'tabContent02'
                            : 'tabContent01',
                        container,
                      },
                    }}
                    as='/book'
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
              hidden={tab !== 'tabContent01'}
              date={date}
              handleDate={handleDate}
              yearMonth={yearMonthStr}
              today={today}
            />
            <Filter hidden={tab !== 'tabContent02'} />
          </div>
        </div>
      </div>
      <div className='component-wrap time-select'>
        {!date && (
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
      `}</style>
    </>
  );
}
