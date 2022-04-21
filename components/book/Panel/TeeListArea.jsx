import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';

import ImgGolf1 from '@/assets/images/IMG_Golf_01.png';
import ImgGolf2 from '@/assets/images/IMG_Golf_02.png';
import ImgGolf3 from '@/assets/images/IMG_Golf_03.png';
import ImgGolf4 from '@/assets/images/IMG_Golf_04.png';
import ImgGolf5 from '@/assets/images/IMG_Golf_05.png';
import ImgGolf6 from '@/assets/images/IMG_Golf_06.png';
import ImgGolf7 from '@/assets/images/IMG_Golf_07.png';
import TeeItem from '@/components/book/Panel/TeeItem';

export const TeeListArea = observer(({ registered }) => {
  const { panelStore } = useStores();
  // [Todo] 전체 선택 Toggle Action Handler(모든 item checkedList에 넣었다가 빼기)
  const TeeImages = [
    ImgGolf1,
    ImgGolf2,
    ImgGolf3,
    ImgGolf4,
    ImgGolf5,
    ImgGolf6,
    ImgGolf7,
  ];
  return (
    <>
      <div className='list_Golfarea'>
        <ul>
          {(registered
            ? panelStore.registeredTeeList
            : panelStore.unregisteredTeeList
          )?.map(tee => (
            <TeeItem
              key={tee.id}
              id={tee.id}
              img={TeeImages[Math.round(Math.random() * 10) % 7]}
              name={tee.name}
              location={tee.address}
              registered={registered}
            />
          ))}
        </ul>
      </div>
      <style jsx>{``}</style>
    </>
  );
});

export default TeeListArea;
