import useStores from '@/stores/useStores';
import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';

const BookContainer = observer(() => {
  // 일단 다 미등록으로 띄움
  const { teeScheduleStore, loadStore, panelStore } = useStores();
  // 등록된 것부터 해야됨
  const registeredTee = useMemo(() => {
    return Object.entries(teeScheduleStore.currentTeeSchedules).filter(
      ([tee_id, _]) => panelStore.registeredKeys.includes(tee_id),
    );
  }, [teeScheduleStore.currentTeeSchedules, panelStore.registeredKeys]);

  const unregisteredTee = useMemo(() => {
    return Object.entries(teeScheduleStore.currentTeeSchedules).filter(
      ([tee_id, _]) => !panelStore.registeredKeys.includes(tee_id),
    );
  }, [teeScheduleStore.currentTeeSchedules, panelStore.registeredKeys]);

  return (
    <>
      {/** 데이터가 없을 때 */}
      <div className='inner-container'>
        {loadStore.isLoading ? (
          <div className='loading-icon'></div>
        ) : teeScheduleStore.isEmpty ? (
          <div className='no-data mt-50'>
            <p className='text-main'>예약 가능한 Tee-off가 없습니다.</p>
          </div>
        ) : (
          <>
            {registeredTee.map(([tee_id, schedules]) => (
              <TeeItem
                key={tee_id}
                id={tee_id}
                name={panelStore.teeListMap?.[tee_id].name}
                area={panelStore.teeListMap?.[tee_id].area}
                schedules={schedules}
                registered
              />
            ))}
            {unregisteredTee.map(([tee_id, schedules], i) => (
              <TeeItem
                key={tee_id + i}
                id={tee_id}
                name={panelStore.teeListMap?.[tee_id].name}
                area={panelStore.teeListMap?.[tee_id].area}
                schedules={schedules}
              />
            ))}
          </>
        )}
      </div>
      <style jsx>{`
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

export default BookContainer;

// 각 Tee별 GolfSchedules array 를 받음
const TeeItem = ({ id, name, area, schedules, registered }) => {
  const teeSchedules = Object.entries(schedules);
  return (
    <>
      {teeSchedules.map(([course, scheduleList]) => (
        <>
          <div className='time-head title-group'>
            <h1 className='head-headline'>
              {name}
              <span className='bar'>{course}</span>
            </h1>
          </div>
          {Object.entries(
            scheduleList.reduce((acc, schedule) => {
              const { hour } = schedule;
              return { ...acc, [hour]: [...(acc?.[hour] || []), schedule] };
            }, {}),
          ).map(([hour, schedules]) => (
            <TeeScheduleList
              key={id + hour}
              hour={hour}
              schedules={schedules}
              registered={registered}
            />
          ))}
        </>
      ))}
    </>
  );
};

const TeeScheduleList = ({ hour, schedules, registered }) => {
  return (
    <div className='time-content'>
      <div className='time-row'>
        <h2 className='title-hour'>{hour}시</h2>
        <div className='box-row multi'>
          {/** 미등록인 item className warning */}
          {schedules?.map(v => (
            <TeeSchedule key={v.id} registered={registered} {...v} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TeeSchedule = ({ id, time, registered, ...others }) => {
  const [hour, min, sec] = time.split(':');
  return (
    <div id={id} className={registered ? 'min' : 'min warning'}>
      {min}
    </div>
  );
};
