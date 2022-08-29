import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import useStores from '@/stores/useStores';
import TeeCheckInput from '@/components/book/Panel/TeeCheckInput';
import HomepageLink from '@/components/layouts/reserve/HomepageLink';

export function TeeItem({ img, registered, handleWarnPopup, type = 'home', ...tee }) {
  const { panelStore, modalStore } = useStores();

  const [loc1, loc2, loc3] = tee.address.split(' ');
  const loc = /\d/.test(loc1) ? `${loc2} ${loc3}` : `${loc1} ${loc2}`;
  // TODO 등록된 골프장 계정 로그인 에러 상태를 반영하는 Badge로 변경
  const [badgeMsg, setBadgeMsg] = useState(!registered ? '미등록' : null);

  // Handler - showModal
  const handleClick = (e) => {
    if(tee.state === 1 || tee.state === 2){
      handleWarnPopup(tee.state);
      return;
    }
    modalStore.setRegistered(registered);
    modalStore.setGolfInfo({ clubId: tee.id, name: tee.name, loc, img, eng: tee.eng });
    modalStore.setModalHidden(false);
  };

  const handleHomepageLink = (e,id, state) => {
    if (window) {
      if (e.stopPropagation) { e.stopPropagation(); } e.cancelBubble = true;
      if(state === 1 || state === 2){
        handleWarnPopup(state);
        return;
      }
      const url = panelStore.teeListMap?.[id]?.homepage;
      const params = { id, url };
      /** WEB->APP */
      if (window.BRIDGE && window.BRIDGE.callHomepageLogin) {
        window.BRIDGE.callHomepageLogin(JSON.stringify(params));
      } else if (window.webkit && window.webkit.messageHandlers ) {
        const payload = JSON.stringify({
          command: 'callHomepageLogin',
          data: JSON.stringify(params),
        });
        window.webkit.messageHandlers.globalMethod.postMessage(payload);
      } else {
        alert(url)
      }
    }
  }

  const stateClass = useMemo(()=>{
    if(tee.state === 0){
      return ''
    }
    if(tee.state === 1){
      return 'red'
    }
    if(tee.state ===2){
      return 'yellow'
    }
    if(tee.state === 3){
      return 'blue'
    }
  },[tee]);

  return (
    <>
      <li className={stateClass}>
        {/* list_detail */}
        <div className='list-detail'  onClick={type === 'home' ? handleClick : undefined}>
          <div className='tee-icon-wrap'>
            <Image className='tee-icon' src={img} width={56} height={56} alt='' />
            <div className={`${stateClass}-icon`} />
          </div>
          <div className='tee-container'>
            <div className='tee-wrap'>
              <p className='tee-name'>{tee.name}</p>
              <span className='tee-detail'>
                {!registered && (
                  <span className='badge bg-shade1'>{badgeMsg}</span>
                )}
                {type === 'home' ? (
                  <span>{loc}</span>
                ) : (
                  <HomepageLink id={tee?.id}>홈페이지 바로가기</HomepageLink>
                )}
              </span>
            </div>
            {
              type==='home' &&
              <div onClick={(e)=>handleHomepageLink(e, tee?.id, tee?.state)} className='homepage-link'>
                  <span>
                  홈페이지
                  </span>
                  <div className='homepage-link-icon'/>
                </div>
              }
          </div>
        </div>
        {/*//list_detail  */}
        {
          type === 'home' ? registered && <TeeCheckInput handleWarnPopup={handleWarnPopup} {...tee} /> : <b>{loc}</b>
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
          flex:1;
          align-items: center;
          gap: 16px;
          width: 90%;
        }
        .tee-container {
          display: flex;
          flex: 1;
          flex-direction: row;
          align-items: center;
        }
        .tee-wrap {
          display: flex;
          flex-direction: column;
          flex: 1;
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
        .homepage-link {
          display: flex;
          align-items: center;
          margin-right: 30px;
          background-color:#f0f0f0;
          color: #979797;
          border-radius: 21px;
          font-size: 10px;
          font-weight: bold;
          padding: 15px;
          height: 20px;
          padding-left: 18px;
          padding-right: 18px;
        }
      `}</style>
    </>
  );
}

export default TeeItem;
