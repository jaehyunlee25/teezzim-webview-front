import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import useStores from '@/stores/useStores';
import { useCallback, useEffect, useRef, useState } from 'react';

const MiniPanel = observer(({ successClubList, setIsLogin }) => {
  const router = useRouter();
  const { container } = router.query;
  const { panelStore } = useStores();
  const [isOpen, setIsOpen] = useState(true);
  const ref = useRef(null);

  const panelName = () => {
    if (container === 'book') return '골프장리스트';
    else if (container === 'wait') return '예약대기';
    else if (container === 'alarm') return '예약오픈 알림';
  };

  const handlePanel = () => {
    if (!ref.current) return;
    setIsOpen(!isOpen);
    if (isOpen) {
      ref.current.style.maxHeight = '300px';
    } else {
      ref.current.style.maxHeight = '100px';
    }
  }

  useEffect(() => {
    if (panelStore.panelHidden) {
      setIsOpen(true);
      ref.current.style.maxHeight = '100px';
    } else {
      setIsLogin(false);
    }
  }, [panelStore.panelHidden]);

  return (
    <>
      <div
        className='rollsheet-wrap'
      >
        <div ref={ref} className='rollsheet-container' onClick={() => handlePanel()}>
          <div className='rollsheet'>
            <div className="allim_reservation">
              <h1 className='head-headline text-white' onClick={() => {
                panelStore.setPanelHidden(false);
                // setIsLogin(false);
              }}>
                {panelName()}
                <div className='arrow-icon' />
              </h1>
              <div className="allimg_icon">
                {/* <span className="allim_num">{panelStore.checkedTeeList.size}</span> */}
              </div>
            </div>
            <div className='allim_sub'>
              {/* <p className='text-sub'>
                {[...panelStore.filterCheckedTeeList]
                  ?.map(v => v.name)
                  .join(', ')}
              </p> */}
              <ul className='text-wrap'>
                {
                  [...panelStore.filterCheckedTeeList]?.map((v, i) => (
                    <li key={i} className={successClubList?.includes(v.eng) ? 'text-sub' : 'empty-text-sub'}>
                      &#183; {v.name}
                    </li>
                  ))
                }
              </ul>
            </div>
            {/* <div className='handle'></div> */}
          </div>
          <div className='arrow-wrap'>
            {
              isOpen ?
                <div className='down-arrow' />
                :
                <div className='up-arrow' />
            }
          </div>
        </div>
      </div>
      <style jsx>{`
        .text-sub {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </>
  );
});

export default MiniPanel;
