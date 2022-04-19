import Calender from '@/components/layouts/book/Calender';
import Filter from '@/components/layouts/book/Filter';
import BookContainer from '@/components/layouts/book/BookContainer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Book() {
  const router = useRouter();
  const {
    query: { tab = 'tabContent01', container = 'Book' },
  } = router;
  const [date, setDate] = useState(null);
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const KST_TIME_DIFF = 9 * 60 * 60 * 1000;
  const kst = new Date(utc + KST_TIME_DIFF);

  const [tyear, tmonth, tdate] = [
    kst.getFullYear(),
    kst.getMonth() + 1, // returns 0 - 11
    kst.getDate(),
  ];
  const tYearMonth = `${tyear}-${tmonth < 10 ? '0' + tmonth : tmonth}`;
  const today = `${tyear}-${tmonth < 10 ? '0' + tmonth : tmonth}-${
    tdate < 10 ? '0' + tdate : tdate
  }`;

  const handleDate = e => {
    const { dateTime } = e.target;
    setDate(dateTime);

    // TODO /schedule/show 연동
    // TODO TeeSchedule Store에 저장
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
                <time dateTime={tYearMonth}>
                  {tyear}년 {tmonth}월
                </time>
              ) : (
                '고급필터'
              )}
            </h1>
            {tab === 'tabContent01' && (
              <div className='date_area'>
                <button
                  type='button'
                  className='                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        btn-mon-prev'
                  disabled
                >
                  <span className='offscreen'>이전달</span>
                </button>
                <button type='button' className='btn-mon-next'>
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
              handleDate={handleDate}
              yearMonth={tYearMonth}
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
