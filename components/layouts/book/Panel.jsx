import NavTab from '@/components/book/Panel/NavTab';
import SearchContainer from '@/components/book/Panel/SearchContainer';

import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import ChipButton from '@/components/common/ChipButton';
import TeeListArea from '@/components/book/Panel/TeeListArea';
import { useEffect } from 'react';

// [Todo] 예약하기 탭이 활성화 되기 전에 서버사이드 렌더링을 통해 tee 정보 받아서 NavTab, tee 목록에 뿌려주기
const PanelComponent = props => {
  const { panelStore } = useStores();

  const dummy1 = [
    {
      id: 0,
      name: '남춘천',
      location: '강원도 춘천시',
      region: '강원도',
    },
    {
      id: 1,
      name: '더플레이스GC',
      location: '강원도 춘천시',
      region: '강원도',
    },
  ];

  const dummy2 = [
    {
      id: 2,
      name: '동촌GC',
      location: '충청북도 충주시',
      region: '충청도',
    },
    {
      id: 3,
      name: '라비에엘',
      location: '강원도 춘천시',
      region: '강원도',
    },
    {
      id: 4,
      name: '레이크사이드CC',
      location: '경기도 용인시',
      region: '수도권',
    },
  ];

  panelStore.setRegisteredTeeList(dummy2);
  panelStore.setTeeList(dummy1);

  console.log(panelStore.teeList);

  useEffect(() => {
    panelStore.initTee();
  }, []);
  return (
    <>
      <SearchContainer />
      <div className='wrapper'>
        <NavTab />
        {/*container inner */}
        <div className='inner'>
          {/*list_Areawrap 지역 골프장리스트  */}
          <div className='list_Areawrap'>
            <div className='list_Areawrap_inner'>
              {/*list_AreaTop  */}
              <div className='list_AreaTop'>
                <span>
                  등록:<b>{panelStore.totalRegisteredTee}</b>
                </span>
                <ChipButton color='dark' padding='4px 12px' radius={30}>
                  전체선택
                </ChipButton>
                {/* <span className='fr'>전체선택</span> */}
              </div>
              {/*//list_AreaTop  */}
              <TeeListArea teeList={panelStore.registeredTeeList} registered />
              {/*list_AreaTop  */}
              <div className='list_AreaTop'>
                <span>
                  미등록:
                  <b>{panelStore.totalUnregisteredTee}</b>
                </span>
                <ChipButton color='dark' padding='4px 12px' radius={30}>
                  전체선택
                </ChipButton>
                {/* <span className='fr'>전체선택</span> */}
              </div>
              {/*//list_AreaTop  */}
              <TeeListArea teeList={panelStore.unregisteredTeeList} />

              {/* bookingwrap 예약/대기/알림 */}
              <div className='bookingwrap'>
                <span>
                  골프장:<b>{panelStore.totalCheckedTee}</b>
                </span>
                <ul className='button-list'>
                  <li className='button'>
                    <a href='#'>실시간 예약</a>
                  </li>
                  <li className='button'>
                    <a href='#'>예약대기</a>
                  </li>
                  <li className='button'>
                    <a href='#'>예약오픈 알림</a>
                  </li>
                </ul>
              </div>
              {/* //bookingwrap 예약/대기/알림 */}
            </div>
          </div>
          {/*//list_Areawrap 지역 골프장리스트  */}
        </div>
        {/* //container inner */}
      </div>
      <style jsx>{`
        .wrapper {
          position: fixed;
          top: 0;
          height: 90%;
          width: 100%;
          z-index: 200;
        }
        .inner {
          height: calc(100% - 110px);
        }
        .list_Areawrap {
          height: 100%;
        }
        .list_Areawrap_inner {
          position: relative;
          overflow: auto;
          height: 100%;
        }
        .list_Areawrap_inner::-webkit-scrollbar {
          display: none;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .bookingwrap {
          position: sticky;
          bottom: 0;
          height: auto;
        }
        .button-list {
          height: auto;
          min-height: max-content;
          align-items: center;
          gap: 4px;
        }
        .button {
          height: auto;
          min-height: max-content;
        }
        .list_AreaTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </>
  );
};

const Panel = () => <PanelComponent />;
export default Panel;
