import useStores from '@/stores/useStores';
import { useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { getDay } from '@/lib/DateUtils';

const WaitContainerComponent = observer(() => {
  const { teeScheduleStore, loadStore, toastStore } = useStores();

  const currentDate = teeScheduleStore.date;

  const [_, mon, date] = currentDate.split('-');
  const day = getDay(currentDate);

  const [times, setTimes] = useState([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ]);

  const waitData = useMemo(
    () =>
      Object.entries(teeScheduleStore.currentTeeSchedules ?? {}).map(
        ([tee_id, schedules]) => {
          return {
            clubId: tee_id,
            waitDate: currentDate,
            waitTime: Object.entries(schedules).reduce(
              (acc, [_, s]) => [
                ...acc,
                ...s
                  .filter(v => times.includes(Number(v.hour)))
                  .map(v => v.time),
              ],
              [],
            ), // schedule ID로 받아야 할 것 같음 => 시간, 골프장ID가 같은데 코스가 다른 경우
          };
        },
      ),
    [times, teeScheduleStore.currentTeeSchedules, currentDate],
  );
  // console.log(waitData);

  const handleWaitButton = e => {
    if (window) {
      /** 예약하기 탭 열림완료 WEB->APP 전송 */
      if (window.BRIDGE && window.BRIDGE.saveWaitReservation) {
        setTimeout(() => {
          // const dataSample = {
          //   // 앱에 보내줄 데이터 형식
          //   clubId: '골프장id',
          //   waitDate: '예약일',
          //   waitTime: ['예약시간' /* 0, 1개 선택해도 배열로! */],
          // };
          const jsonStr = JSON.stringify(waitData);
          window.BRIDGE.saveWaitReservation(jsonStr);
        }, 100); // 약간 지연
      }
    }
    toastStore.setMessage(
      <>
        {mon}월 {date}일 ({day}요일) {waitData.length}개 골프장에
        <br /> 예약대기를 만들었습니다.
      </>,
    );
    toastStore.setHidden(false);
  };

  const handleChecked = e => {
    const { value } = e.target;
    const targetTimes = value.split(',').map(v => Number(v));
    if (new Set([...targetTimes, ...times]).size === times.length)
      setTimes(times.filter(v => !targetTimes.includes(v)));
    else setTimes([...times, ...targetTimes]);
  };

  return (
    <>
      {loadStore.isLoading ? (
        <div className='loading-icon'></div>
      ) : (
        <>
          <div className='component-wrap time-select'>
            <div className='inner-container'>
              <div className='time-head title-group'>
                <h1 className='head-headline'>라운딩 희망시간:</h1>
              </div>
              <div className='form type-row'>
                <div className='form-content'>
                  <ul className='option-group-list col-group col-5 space'>
                    <li>
                      <div className='check-box round row'>
                        <input
                          type='checkbox'
                          name='sCheck21'
                          id='sCheck21'
                          value='5,6'
                          checked={
                            new Set([...times, 5, 6]).size === times.length
                          }
                          onChange={handleChecked}
                          disabled={waitData.length === 0}
                        />
                        <label htmlFor='sCheck21' className='time'>
                          <span className='text-r'>
                            오전 5시
                            <br /> ~ 7시
                          </span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className='check-box round row'>
                        <input
                          type='checkbox'
                          name='sCheck22'
                          id='sCheck22'
                          value='7,8'
                          checked={
                            new Set([...times, 7, 8]).size === times.length
                          }
                          onChange={handleChecked}
                          disabled={waitData.length === 0}
                        />
                        <label htmlFor='sCheck22' className='time'>
                          <span className='text-r'>
                            오전 7시
                            <br /> ~ 9시
                          </span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className='check-box round row'>
                        <input
                          type='checkbox'
                          name='sCheck23'
                          id='sCheck23'
                          value='11,12'
                          checked={
                            new Set([...times, 11, 12]).size === times.length
                          }
                          onChange={handleChecked}
                          disabled={waitData.length === 0}
                        />
                        <label htmlFor='sCheck23' className='time'>
                          <span className='text-r'>
                            오전 11시
                            <br /> ~ 1시
                          </span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className='check-box round row'>
                        <input
                          type='checkbox'
                          name='sCheck24'
                          id='sCheck24'
                          value='13,14,15,16,17,18,19,20'
                          checked={
                            new Set([...times, 13, 14, 15, 16, 17, 18, 19, 20])
                              .size === times.length
                          }
                          onChange={handleChecked}
                          disabled={waitData.length === 0}
                        />
                        <label htmlFor='sCheck24' className='time'>
                          <span className='text-r'>
                            오후 1시
                            <br /> ~ 이후
                          </span>
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className='check-box round row'>
                        <input
                          type='checkbox'
                          name='sCheck25'
                          id='sCheck25'
                          value='21,22,23,0,1,2,3,4'
                          checked={
                            new Set([...times, 21, 22, 23, 0, 1, 2, 3, 4])
                              .size === times.length
                          }
                          onChange={handleChecked}
                          disabled={waitData.length === 0}
                        />
                        <label htmlFor='sCheck25' className='time'>
                          <span className='text-c'>
                            야간
                            <br /> ~
                          </span>
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className='component-wrap'>
            <div className='inner-container'>
              <div className='btn-group'>
                <button
                  type='button'
                  className='btn large wide round primary'
                  onClick={handleWaitButton}
                  disabled={waitData.length === 0}
                >
                  예약대기 만들기
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <style jsx>{`
        .btn-group {
          display: flex;
          justify-content: center;
        }
        .loading-icon {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
          margin-top: 60px;
          width: 40px;
          height: 40px;
        }
      `}</style>
    </>
  );
});

const WaitContainer = () => <WaitContainerComponent />;
export default WaitContainer;
