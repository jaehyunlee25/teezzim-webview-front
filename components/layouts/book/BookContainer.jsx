import useStores from '@/stores/useStores';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

const BookContainer = observer(() => {
  // TODO TeeSchedule Store에 저장된 Schedule List 가져와서 렌더링하기
  // 일단 다 미등록으로 띄움
  const { teeScheduleStore } = useStores();
  // useEffect(() => {

  // })
  return (
    <>
      {/** 데이터가 없을 때 */}
      {teeScheduleStore.isEmpty ? (
        <div className='inner-container'>
          <div className='no-data mt-50'>
            <p className='text-main'>예약 가능한 Tee-off가 없습니다.</p>
          </div>
        </div>
      ) : (
        teeScheduleStore.teeScheduleList?.map(v => (
          <TeeItem key={v.id} {...v} />
        ))
      )}
    </>
  );
});

export default BookContainer;

// 각 Tee별 GolfSchedules array 를 받음
const TeeItem = ({ id, name, course, GolfSchedules }) => {
  const schedules = GolfSchedules.map(v => {
    const [hour, min, _] = v.time.split(':');
    return { ...v, tee_id: id, hour, min };
  });

  const keys = [...new Set(schedules.map(v => v.hour))];
  const schedulesOnHour = keys.map(hour => ({
    hour,
    schedules: schedules.filter(v => v.hour === hour),
  }));

  return (
    <div className='inner-container'>
      <div className='time-head title-group'>
        <h1 className='head-headline'>
          {name}
          <span className='bar'>{course}</span>
        </h1>
      </div>
      {/** TODO 해당 Tee의 GolfSchedule에서 시간대별 배열 필요 */}
      {schedulesOnHour.map(v => (
        <TeeSchedule key={v.hour} {...v} />
      ))}
    </div>
  );
};

const TeeSchedule = ({ hour, schedules }) => {
  return (
    <div className='time-content'>
      <div className='time-row'>
        <h2 className='title-hour'>{hour}시</h2>
        <div className='box-row multi'>
          {/** 미등록인 item className warning */}
          {schedules?.map(v => {
            return (
              <div key={v.id} className='min warning'>
                {v.min}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
