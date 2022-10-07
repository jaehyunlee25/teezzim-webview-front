import Image from 'next/image';
import { observer } from 'mobx-react-lite';
import useStores from '@/stores/useStores';
import { useState } from 'react';
import IMG_Golf_01 from '@/assets/images/IMG_Golf_01.png'; // 임시

const ReLoginModalComponent = observer(({ cb, errCb, handleClose }) => {
  const { modalStore, authStore } = useStores();
  const [popupHidden, setPopupHidden] = useState(true);

  const removeLoginInfo = e => {
    if (window.BRIDGE && window.BRIDGE.removeLoginInfo) {
      try {
        window.BRIDGE.removeLoginInfo(modalStore.golfInfo.clubId);
        modalStore.setRegistered(false);
        authStore.communicate(false);
        if (cb) cb();
      } catch {
        if (errCb) errCb();
      }
    } else if (window.webkit && window.webkit.messageHandlers ) {
      try {
        const payload = JSON.stringify({
          command: 'removeLoginInfo',
          data: modalStore.golfInfo.clubId,
        });
        window.webkit.messageHandlers.globalMethod.postMessage(payload);
        modalStore.setRegistered(false);
        authStore.communicate(false);
        if (cb) cb();
      } catch {
        if (errCb) errCb();
      }
    } else {
      alert('이 기능은 앱에서만 동작합니다.');
      return;
    }
    authStore.setIsResetSearchValue(false);
  };

  return (
    <>
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
        </div>

        {modalStore.errCode && (
          <div className='notworking'>
            <span className='medium-Emphasis02'>
              {modalStore.errCode === -1 ? (
                <>
                  골프장 계정 정보를 변경하셨나요?
                  <br />
                  골프장 로그인에 실패했습니다.
                </>
              ) : (
                <>
                  골프장 홈페이지 서버가 점검 중이거나 <br />
                  홈페이지 정보가 변경 되었습니다.
                  <br />
                  확인 후 빠른 시일 내에 정상화하겠습니다.
                </>
              )}
            </span>
          </div>
        )}

        <div className='btn-apply  btn-apply_fix'>
          {modalStore.errCode === 500 ? (
            <button type='button' className='bg-white' onClick={handleClose}>
              확인
            </button>
          ) : (
            <>
              {/* <span className='text-black medium-Emphasis02'>
                [재설정]시 사용하던 골프장 계정 정보를 지우고 새로 설정합니다.
              </span> */}
              <button
                type='button'
                className='bg-surface1 text-white'
                onClick={() => setPopupHidden(false)}
              >
                등록해제
              </button>
            </>
          )}
        </div>
      </div>
      <div className='pop_Common' hidden={popupHidden}>
        <div className='pop_Notice'>
          <p className='medium-Emphasis01'>
            등록을 해제합니다.
          </p>
          <div className='Buttonwrap'>
            <span
              className='fl bg-surface1 text-white'
              onClick={() => {
                setPopupHidden(true);
                removeLoginInfo();
                handleClose();
              }}
            >
              확인
            </span>
            <span
              className='fl bg-white text-action'
              onClick={() => setPopupHidden(true)}
            >
              취소
            </span>
          </div>
        </div>
      </div>

      <style jsx>{``}</style>
    </>
  );
});

const ReLoginModal = props => <ReLoginModalComponent {...props} />;
export default ReLoginModal;
