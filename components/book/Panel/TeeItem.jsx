import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import useStores from '@/stores/useStores';
import TeeCheckInput from '@/components/book/Panel/TeeCheckInput';
import HomepageLink from '@/components/layouts/reserve/HomepageLink';

export function TeeItem({ img, registered, type = 'home', ...tee }) {
  const { panelStore, modalStore } = useStores();

  const [loc1, loc2, loc3] = tee.address.split(' ');
  const loc = /\d/.test(loc1) ? `${loc2} ${loc3}` : `${loc1} ${loc2}`;
  // TODO 등록된 골프장 계정 로그인 에러 상태를 반영하는 Badge로 변경
  const [badgeMsg, setBadgeMsg] = useState(!registered ? '미등록' : null);

  // Handler - showModal
  const handleClick = () => {
    modalStore.setRegistered(registered);
    modalStore.setGolfInfo({ clubId: tee.id, name: tee.name, loc, img, eng: tee.eng });
    modalStore.setModalHidden(false);
  };

  return (
    <>
      <li>
        {/* list_detail */}

        <div className='list-detail'>
          <Image className='tee-icon' src={img} width={56} height={56} alt='' />
          <div>
            <p className='tee-name'>{tee.name}</p>
            <span
              className='tee-detail'
              onClick={type === 'home' ? handleClick : undefined}
            >
              {!registered ? (
                <span className='badge bg-shade1'>{badgeMsg}</span>
              ) : null}
              {type === 'home' ? (
                <span>{loc}</span>
              ) : (
                <HomepageLink id={tee?.id}>홈페이지 바로가기</HomepageLink>
              )}
            </span>
          </div>
        </div>
        {/*//list_detail  */}
        {
          type === 'home' ? registered && <TeeCheckInput {...tee} /> : <b>{loc}</b>
        }
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
        li:after {
          content: unset;
        }
        .list-detail {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .tee-name {
          font-size: 16px;
          padding-bottom: 6.5px;
          line-height: 1.31;
        }
        .tee-detail {
          font-size: 12px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

export default TeeItem;
