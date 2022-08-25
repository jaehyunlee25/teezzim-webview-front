import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';

import TeeItem from '@/components/book/Panel/TeeItem';

export const TeeListArea = ({ registered, list, handleWarnPopup }) => {
  const { globalStore } = useStores();
  return (
    <>
      <div className='list_Golfarea'>
        <ul>
          {list?.map((tee, i) => (
            <TeeItem
              handleWarnPopup={handleWarnPopup}
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
