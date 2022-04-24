const TeeSchedule = ({ id, time, registered, ...others }) => {
  const [hour, min, sec] = time.split(':');
  return (
    <div id={id} className={registered ? 'min' : 'min warning'}>
      {min}
    </div>
  );
};

export default TeeSchedule;
