import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useRef } from 'react';
import DetailModal from './DetailModal';
import LoginModal from './LoginModal';
import ReLoginModal from './ReLoginModal';

const ModalContainerComponent = observer(({ children, hidden }) => {
  const { modalStore } = useStores();
  const ref = useRef(null);

  const handleClose = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.animation = 'fadeOutDown 0.25s forwards';
    setTimeout(() => {
      modalStore.setModalHidden(true);
      ref.current.style.animation = 'fadeInUp 0.25s';
    }, 300);
  }, [modalStore]);

  const title = useMemo(()=>{
    if(modalStore.visiblePath === 'Login') return '계정등록';
    if(modalStore.visiblePath === 'ReLogin') return '등록해제';
    if(modalStore.visiblePath === 'Detail') return '골프장 관련 상세정보보기';
    return '';
  },[modalStore.visiblePath]);

  return (
    <>
      <div id='modal-container' ref={ref} hidden={hidden}>
        <div className='title-top'>
          <h1>{title}</h1>
          <span className='btn-close' onClick={handleClose}>
            close
          </span>
        </div>
        {
          modalStore.visiblePath === 'Login' &&
          <LoginModal handleClose={handleClose} />
        }
        {
          modalStore.visiblePath === 'ReLogin' &&
          <ReLoginModal handleClose={handleClose} />
        }
        {
          modalStore.visiblePath === 'Detail' &&
          <DetailModal handleClose={handleClose} />
        }
      </div>
      <style jsx>{`
        #modal-container {
          position: absolute;
          width: 100%;
          min-height: 100vh;
          z-index: 4000;
          background-color: #fff;
          padding: 0;
          animation: fadeInUp 0.25s;
        }
        .title-top {
          padding: 8px 16px;
        }
        .btn-close {
          top: 16px;
          left: 16px;
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translate(0, 100%);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0);
          }
        }
        @keyframes fadeOutDown {
          0% {
            opacity: 1;
            transform: translate(0, 0);
          }
          100% {
            opacity: 0;
            transform: translate(0, 100%);
          }
        }
      `}</style>
    </>
  );
});

const ModalContainer = props => <ModalContainerComponent {...props} />;
export default ModalContainer;
