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

export const TeeListArea = ({ registered, list }) => {
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
          {list?.map((tee, i) => (
            <TeeItem
              key={tee.id}
              img={TeeImages[i % 7]}
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
