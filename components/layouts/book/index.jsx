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
import Calender from '@/components/layouts/book/Calendar';
import Filter from '@/components/layouts/book/Filter';
import Panel from '@/components/layouts/book/Panel';
import { observer } from 'mobx-react-lite';

import BookContainer from '@/components/layouts/book/BookContainer';
import WaitContainer from '@/components/layouts/book/WaitContainer';
import AlarmContainer from '@/components/layouts/book/AlarmContainer';

export default function Book() {
  const router = useRouter();
  const { teeScheduleStore, loadStore } = useStores();
  const {
    query: { subTab = 'tabContent01', container = 'book', ...others },
  } = router;

  /** Calender Component */
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

  /** Panel Component */
  const [panelHidden, setPanelHidden] = useState(false);

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

  const [test, setTest] = useState('');
  // TODO rollsheet-wrap component 분리하기
  // TODO panelStore에 있는 checked list 전달하기
  return (
    <>
      <Panel hidden={panelHidden} setHidden={setPanelHidden} />

      {/* <div className='rollsheet-wrap' onClick={() => setPanelHidden(false)}>
        <div className='rollsheet-container'>
          <div className='rollsheet'>
            <h1 className='head-headline text-primary'>예약오픈 알림(1):</h1>
            <p className='text-sub'>더플레이어스GC</p>
            <div className='handle'></div>
          </div>
        </div>
      </div> */}
      <MiniPanel setPanelHidden={setPanelHidden} />
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

const MiniPanel = observer(({ setPanelHidden }) => {
  const router = useRouter();
  const { container } = router.query;
  const { panelStore } = useStores();

  const panelName = () => {
    if (container === 'book') return '실시간 예약';
    else if (container === 'wait') return '예약대기';
    else if (container === 'alarm') return '예약오픈 알림';
  };

  return (
    <>
      <div className='rollsheet-wrap' onClick={() => setPanelHidden(false)}>
        <div className='rollsheet-container'>
          <div className='rollsheet'>
            <h1 className='head-headline text-primary'>
              {panelName()}({panelStore.checkedTeeList.size}):
            </h1>
            <p className='text-sub'>
              {[...panelStore.checkedTeeList]
                ?.map(v => JSON.parse(v).name)
                .join(', ')}
            </p>
            <div className='handle'></div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .text-sub {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </>
  );
});
