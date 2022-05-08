import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import { useCallback, useRef } from 'react';
import LoginModal from './LoginModal';
import ReLoginModal from './ReLoginModal';

const ModalContainerComponent = observer(({ title, children, hidden }) => {
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

  return (
    <>
      <div id='modal-container' ref={ref} hidden={hidden}>
        <div className='title-top'>
          <h1>{title}</h1>
          <span className='btn-close' onClick={handleClose}>
            close
          </span>
        </div>
        {modalStore.registered ? (
          <ReLoginModal handleClose={handleClose} />
        ) : (
          <LoginModal handleClose={handleClose} />
        )}
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
