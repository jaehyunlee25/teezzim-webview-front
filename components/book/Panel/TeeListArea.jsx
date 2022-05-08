import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';

import TeeItem from '@/components/book/Panel/TeeItem';

export const TeeListArea = ({ registered, list }) => {
  const { globalStore } = useStores();

  return (
    <>
      <div className='list_Golfarea'>
        <ul>
          {list?.map((tee, i) => (
            <TeeItem
              key={tee.id}
              img={globalStore.TeeImages[i % 7]}
              registered={registered}
              {...tee}
            />
          ))}
        </ul>
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export default TeeListArea;
