import Image from 'next/image';
import { observer } from 'mobx-react-lite';
import useStores from '@/stores/useStores';
import IMG_Golf_01 from '@/assets/images/IMG_Golf_01.png'; // 임시
import PopUp from '../PopUp';
import { useState } from 'react';

const DetailModalComponent = observer(({ cb, errCb }) => {
  const { modalStore } = useStores();
  const [isHidePopup, setIsHidePopup] = useState(true);

  const handleClick = command => {
    const res = {
      command : command,
      club_id : modalStore.golfInfo?.clubId
    }
    window.BRIDGE.sendResponse(JSON.stringify(res));
  }

  return (
    <>
      <PopUp
        smallClose={true}
        hidden={isHidePopup}
        buttonText='확인'
        onButtonClick={e => {
          setIsHidePopup(true);
        }}
      >
        <div className='phone_icon mt-30 mb-5' />
        <div className='call_popup mb-20'>
          <strong>
            {modalStore.golfInfo?.phone}
          </strong>
        </div>
      </PopUp>
      <div className='login_wrap'>
        <div className='login_img'>
          <Image
            src={modalStore.golfInfo?.img ?? IMG_Golf_01}
            alt=''
            width='100%'
            height='100%'
          />
          <p className='heading-title_03'>{modalStore.golfInfo?.name}</p>
          <span className='caption'>{modalStore.golfInfo?.loc}</span>
          <div className='detail_nav_wrap'>
            <div className='detail_nav' onClick={()=>handleClick('showWeatherInfo')}>
              <div className='weather_icon' />
              <p className='nav_title'>날씨정보</p>
              <div className='right_arrow_icon' />
            </div>
            <div className='detail_nav' onClick={()=>handleClick('showTrafficInfo')}>
              <div className='traffic_icon' />
              <p className='nav_title'>교통정보/내비게이션</p>
              <div className='right_arrow_icon' />
            </div>
            <div className='detail_nav' onClick={()=>handleClick('showFoodMenuInfo')}>
              <div className='menu_icon' />
              <p className='nav_title'>클럽하우스식당메뉴</p>
              <div className='right_arrow_icon' />
            </div>
            <div className='detail_nav' onClick={()=>handleClick('showNearbyRestaurantInfo')}>
              <div className='restaurants_icon' />
              <p className='nav_title'>주변식당정보</p>
              <div className='right_arrow_icon' />
            </div>
            {/* <div className='detail_nav' onClick={()=>setIsHidePopup(false)}>
              <div className='call_icon' />
              <p className='nav_title'>전화번호</p>
              <div className='right_arrow_icon' />
            </div>
            <div className='detail_nav' onClick={()=>handleClick('showEventInfo')}>
              <div className='event_icon' />
              <p className='nav_title'>이벤트</p>
              <div className='right_arrow_icon' />
            </div>
            <div className='detail_nav' onClick={()=>handleClick('showDefaultInfo')}>
              <div className='default_icon' />
              <p className='nav_title'>기본정보</p>
              <div className='right_arrow_icon' />
            </div> */}
          </div>
        </div>
      </div>

      <style jsx>{``}</style>
    </>
  );
});

const DetailModal = props => <DetailModalComponent {...props} />;
export default DetailModal;
