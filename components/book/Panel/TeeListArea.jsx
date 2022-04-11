import ChipButton from '@/components/common/ChipButton';
import Image from 'next/image';

import ImgGolf1 from '@/assets/images/IMG_Golf_01.png';
import ImgGolf2 from '@/assets/images/IMG_Golf_02.png';
import ImgGolf3 from '@/assets/images/IMG_Golf_03.png';
import ImgGolf4 from '@/assets/images/IMG_Golf_04.png';
import ImgGolf5 from '@/assets/images/IMG_Golf_05.png';
import ImgGolf6 from '@/assets/images/IMG_Golf_06.png';
import ImgGolf7 from '@/assets/images/IMG_Golf_07.png';
import { useEffect, useState } from 'react';
import useStores from '@/stores/useStores';

export default function TeeListArea({ teeList, registered }) {
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
          {teeList.map(tee => (
            <TeeItem
              key={tee.id}
              id={tee.id}
              img={TeeImages[tee.id % 6]}
              name={tee.name}
              location={tee.location}
              registered={registered}
            />
          ))}
        </ul>
      </div>
      <style jsx>{``}</style>
    </>
  );
}

// [Todo] 등록하기 API 결과 여부를 전달해 status로 전달한다.
export function TeeItem({ img, id, name, registered, location }) {
  const { panelStore } = useStores();
  const [badgeMsg, setBadgeMsg] = useState(!registered ? '미등록' : null);
  const [checked, setChecked] = useState(false);

  const { pushCheckedTeeList, popCheckedTeeList, checkedTeeList } = panelStore;
  const handleChecked = e => {
    const id = e.target.htmlFor || e.target.id;
    console.log(checkedTeeList.includes(id));
    if (checkedTeeList.includes(id)) popCheckedTeeList(id);
    else pushCheckedTeeList(id);
    // console.log(panelStore.checkedTeeList);
  };
  useEffect(() => {
    panelStore.initTee();
  }, []);
  return (
    <>
      <li>
        {/* list_detail */}

        <div className='list-detail'>
          <Image className='tee-icon' src={img} width={56} height={56} alt='' />
          <div>
            <p className='tee-name'>{name}</p>
            <span className='tee-detail'>
              {!registered ? (
                <span className='badge bg-shade1'>{badgeMsg}</span>
              ) : null}
              {location}
            </span>
          </div>
        </div>
        {/*//list_detail  */}
        {/*btn_check_box  */}
        <div className='btn_check_box'>
          <span className='checkbox'>
            <input
              id={id}
              type='checkbox'
              name={name}
              checked={panelStore.checkedTeeList.includes(id)}
              onChange={() => {
                setChecked(!checked);
                console.log(checkedTeeList);
              }}
            />
            <label htmlFor={id} onClick={handleChecked}></label>
          </span>
        </div>
        {/*//btn_check_box  */}
      </li>
      <style jsx>{`
        .badge {
          background-color: ${badgeMsg === '미등록'
            ? 'var(--warning-shade-1)'
            : ' var(--warning-surface-2)'};
          margin-right: 4px;
          line-height: 1.67;
          border-radius: 4px;
          padding: 1px 8px;
        }
        ul {
          width: 100%;
        }
        li {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .list-detail {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .tee-name {
          font-size: 16px;
          padding-top: 6.5px;
          line-height: 1.31;
        }
        .tee-detail {
          font-size: 12px;
        }
        .btn_check_box {
          position: absolute;
          right: 16px;
        }
        label {
          padding: 8px;
        }
      `}</style>
    </>
  );
}
