import { useRouter } from 'next/router';

const TeeSchedule = ({ id, time, registered, ...others }) => {
  const router = useRouter();
  const [_, min, __] = time.split(':');
  return (
    <div
      id={id}
      className={registered ? 'min' : 'min warning'}
      onClick={() =>
        router.push({
          pathname: '/reserve/create/[id]',
          query: { ...router.query, id },
        })
      }
    >
      {min}
    </div>
  );
};

export default TeeSchedule;
