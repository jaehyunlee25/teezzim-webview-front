import TeeScheduleList from '@/components/book/BookContainer/TeeScheduleList';
import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

// 각 Tee별 GolfSchedules array 를 받음
const TeeItem = observer(({ id, name, area, schedules, registered }) => {
  const { teeScheduleStore } = useStores();
  const teeSchedules = Object.entries(schedules);
  const scheduleOnHour = useCallback(
    scheduleList => {
      const result = Object.entries(
        scheduleList.reduce((acc, schedule) => {
          const { hour } = schedule;
          return { ...acc, [hour]: [...(acc?.[hour] || []), schedule] };
        }, {}),
      )
        .filter(([hour, _]) => teeScheduleStore.times.includes(Number(hour)))
        .sort((a, b) => a[0] - b[0])
        .map(([hour, schedules], i) => (
          <TeeScheduleList
            key={id + hour + i}
            hour={hour}
            schedules={schedules}
            registered={registered}
          />
        ));
      return result.length > 0 ? (
        result
      ) : (
        <p>선택하신 시간대에 예약 가능한 Tee-off가 없습니다.</p>
      );
    },
    [teeScheduleStore.times, id, registered],
  );
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
          {scheduleOnHour(scheduleList)}
        </>
      ))}
    </>
  );
});

export default TeeItem;
