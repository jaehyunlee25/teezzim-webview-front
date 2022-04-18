const Calender = ({ handleDate, today, ...others }) => {
  return (
    <>
      <div
        id='tabContent01'
        // className='tab-content'
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
            <button className='sunday prev-mon'>
              <time dateTime='2022-03-27'>27</time>
              <p className='number'>
                <strong>&nbsp;</strong>
              </p>
            </button>
            <button className='today'>
              <time
                dateTime='2022-03-28'
                className='prev-mon'
                onClick={handleDate}
              >
                28
              </time>
              <p className='number'>
                <strong>336</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-03-29'>29</time>
              <p className='number'>
                <strong>336</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-03-30'>30</time>
              <p className='number'>
                <strong>336</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-03-31'>31</time>
              <p className='number'>
                <strong>336</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-01'>4/1</time>
              <p className='number'>
                <strong>336</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-02'>2</time>
              <p className='number'>
                <strong>336</strong>T
              </p>
            </button>
            <button className='sunday'>
              <time dateTime='2022-04-03'>3</time>
              <p className='number'>
                <strong>320</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-04'>4</time>
              <p className='number'>
                <strong>320</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-05'>5</time>
              <p className='number'>
                <strong>320</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-06'>6</time>
              <p className='number'>
                <strong>320</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-07'>7</time>
              <p className='number'>
                <strong>320</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-08'>8</time>
              <p className='number'>
                <strong>320</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-09'>9</time>
              <p className='number'>
                <strong>320</strong>T
              </p>
            </button>
            <button className='sunday'>
              <time dateTime='2022-04-10'>10</time>
              <p className='number'>
                <strong>4</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-11'>11</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-12'>12</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-13'>13</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-14'>14</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-15'>15</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-16'>16</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
            <button className='sunday'>
              <time dateTime='2022-04-17'>17</time>
              <p className='number'>
                <strong>146</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-18'>18</time>
              <p className='number'>
                <strong>146</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-19'>19</time>
              <p className='number'>
                <strong>146</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-20'>20</time>
              <p className='number'>
                <strong>146</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-21'>21</time>
              <p className='number'>
                <strong>146</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-22'>22</time>
              <p className='number'>
                <strong>146</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-23'>23</time>
              <p className='number'>
                <strong>146</strong>T
              </p>
            </button>
            <button className='sunday'>
              <time dateTime='2022-04-24'>24</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-25'>25</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-26'>26</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-27'>27</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-28'>28</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-29'>29</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
            <button>
              <time dateTime='2022-04-24'>30</time>
              <p className='number'>
                <strong>316</strong>T
              </p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calender;

const DateButton = (date = '2022-04-15', count, className, ...others) => {
  const dateText = date.split('-')[2];
  const day = new Date(date).getUTCDay();
  const classes = className ?? '';
  return (
    <>
      <button
        className={day === 0 ? 'sunday ' + className : className}
        {...others}
      >
        <time dateTime={date}>{dateText}</time>
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
        button.on {
          background-color: var(--brand-primary);
          color: var(--neutrals-white);
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};
