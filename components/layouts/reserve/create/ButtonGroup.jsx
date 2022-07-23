import axios from 'axios';
import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import HomepageLink from '@/components/layouts/reserve/HomepageLink';

const ButtonGroup = observer(
  ({ clubId, postInfo, source, cb, errCb, onButtonClick, golfInfo }) => {
    const { panelStore, authStore, modalStore, globalStore } = useStores();
    const [{ id, password } = {}] =
      authStore.authList?.filter(auth => auth.clubId == clubId) ?? [];

    const handleCreateReserve = async () => {
      if (!id || !password) return;
      if (onButtonClick) onButtonClick();
      // const club_id = golfInfo.id;
      // const resp = await axios.get(`/teezzim/teeapi/v1/club/eng/${club_id}`);
      // const club = resp.data.data.eng_id;
      // const data = { club, club_id , ...postInfo };
      // 예약하기 브릿지 메소드
      // try {
        // if (window.BRIDGE && window.BRIDGE.requestReserve) {
        //   window.BRIDGE.requestReserve(JSON.stringify(data));
        // } else if (window.webkit && window.webkit.messageHandlers ) {
        //   window.webkit.messageHandlers.requestReserve.postMessage(JSON.stringify(data));
        // } else {
        //   alert('이 기능은 앱에서만 동작합니다.' + JSON.stringify(params));
        // }
      //   if (cb) cb();
      // } catch {
      //   if (errCb) errCb();
      // }
      

      const res = await axios
        .post(
          `/teezzim/teeapi/v1/club/${id}/reservation/post`,
          {
            id,
            password,
            ...postInfo,
          },
          { cancelToken: source.token },
        )
        .catch(err => {
          console.warn(err);
        });

      const {
        data = null,
        resultCode = null,
        message = null,
      } = res?.data ?? {};

      if (res?.status === 200) {
        if (resultCode === 1) {
          if (cb) cb();
        } else {
          if (errCb) errCb();
          console.warn(`[errorCode : ${resultCode}] ${message}`);
        }
      } else {
        if (errCb) errCb();
        console.warn('unhandled error');
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
                  className='btn large rest full'
                  onClick={handleCreateReserve}
                >
                  간편예약
                </button>
              </li>
              <li>
                <HomepageLink
                  id={clubId}
                  type='button'
                  className='btn large rest full'
                >
                  홈페이지예약
                </HomepageLink>
              </li>
            </ul>
          </div>
        ) : (
          <div className='component-wrap'>
            <ul className='btn-group btn-group__fixed'>
              <HomepageLink
                id={clubId}
                type='button'
                className='btn large rest full'
              >
                골프장 회원가입
              </HomepageLink>

              <li>
                <button
                  type='button'
                  className='btn large rest full'
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
            bottom: 72px;
          }
        `}</style>
      </>
    );
  },
);

export default ButtonGroup;
