import { useRouter } from 'next/router';

const TeeSchedule = ({ id, time, registered, tee_id, ...others }) => {
  const router = useRouter();
  const [_, min, __] = time.split(':');
  return (
    <div
      id={id}
      className={registered ? 'min text-primary' : 'min warning text-primary'}
      onClick={() =>
        router.push({
          pathname: '/reserve/create/[id]',
          query: { ...router.query, id, tee_id },
        })
      }
    >
      {min}
    </div>
  );
};

export default TeeSchedule;
