import axios from 'axios';
import { useEffect } from 'react';
import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import HomepageLink from '@/components/layouts/reserve/HomepageLink';

const ButtonGroup = observer(
  ({ clubId, postInfo, source, cb, errCb, onButtonClick, golfInfo }) => {
    const { panelStore, authStore, modalStore, globalStore } = useStores();
    const [{ id, password } = {}] =
      authStore.authList?.filter(auth => auth.clubId == clubId) ?? [];

    useEffect(() => {
      if(window){
        // console.log("### responseReserve 바인딩됨");
        /** APP->WEB */
        window.responseReserve = function (result) {
          console.log("### responseReserve 호출됨 " + result);
          if ( result == "OK" ){
            cb();
          } else {
            errCb();
          }
        };
      }
    }, []);

    const handleCreateReserve = async () => {
      if (!id || !password) return;
      // if (onButtonClick) onButtonClick(); // 예약중 팝업 off
      const club_id = golfInfo.id;
      const resp = await axios.get(`/teezzim/teeapi/v1/club/eng/${club_id}`);
      const club = resp.data.data.eng_id;
      const data = { club, club_id , ...postInfo };
      try {
        // 예약하기 브릿지 메소드 호출
        if (window.BRIDGE && window.BRIDGE.requestReserve) {
          window.BRIDGE.requestReserve(JSON.stringify(data));
        } else if (window.webkit && window.webkit.messageHandlers ) {
          window.webkit.messageHandlers.requestReserve.postMessage(JSON.stringify(data));
        } else {
          alert('이 기능은 앱에서만 동작합니다.' + JSON.stringify(params));
        }
        // if (cb) cb();
      } catch {
        if (errCb) errCb();
      }
    };

    const handleRegisterAccount = () => {
      modalStore.setRegistered(panelStore.registeredKeys.includes(clubId));
      if (!golfInfo?.address) return;
      const [loc1, loc2, loc3] = golfInfo.address.split(' ');
      const loc = /\d/.test(loc1) ? `${loc2} ${loc3}` : `${loc1} ${loc2}`;

      modalStore.setGolfInfo({
        clubId,
        name: golfInfo?.name,
        loc,
        img: globalStore.TeeImages[Math.floor((Math.random() * 10) % 7)],
      });
      modalStore.setModalHidden(false);
    };

    return (
      <>
        {panelStore.registeredKeys.includes(clubId) ? (
          <div className='component-wrap'>
            <ul className='btn-group btn-group__fixed'>
              <li>
                <button
                  type='button'
                  className='btn large primary roundbtn full'
                  onClick={handleCreateReserve}
                >
                  간편예약
                </button>
              </li>
              <li>
                <HomepageLink
                  id={clubId}
                  type='button'
                  className='btn large primary roundbtn full'
                >
                  홈페이지예약
                </HomepageLink>
              </li>
            </ul>
          </div>
        ) : (
          <div className='component-wrap'>
            <ul className='btn-group btn-group__booking'>
              <HomepageLink
                id={clubId}
                type='button'
                className='btn large primary roundbtn full'
              >
                골프장 회원가입
              </HomepageLink>

              <li>
                <button
                  type='button'
                  className='btn large primary roundbtn full'
                  onClick={handleRegisterAccount}
                >
                  골프장 계정등록
                </button>
              </li>
            </ul>
          </div>
        )}
        <style jsx>{`
          .btn-group {
            display: flex;
          }
        `}</style>
      </>
    );
  },
);

export default ButtonGroup;
