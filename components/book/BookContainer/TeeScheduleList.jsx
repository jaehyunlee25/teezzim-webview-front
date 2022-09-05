import TeeSchedule from '@/components/book/BookContainer/TeeSchedule';

const TeeScheduleList = ({ hour, schedules, ...others }) => {
  return (
    <div className='time-content inner-container'>
      <div className='time-row'>
        <h2 className='title-hour'>{hour}시</h2>
        <div className='box-row multi'>
          {/** 미등록인 item className warning */}
          {schedules?.map(v => (
            <TeeSchedule key={v.id} {...others} {...v} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeeScheduleList;
