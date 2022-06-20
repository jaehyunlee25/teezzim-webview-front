import { useEffect } from 'react';
import Toast from '@/components/common/Toast';
import BottomMenu from '@/components/layouts/BottomMenu';
import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import LoginModal from '../common/Modal/LoginModal';
import ModalContainer from '../common/Modal/ModalContainer';
import ReLoginModal from '../common/Modal/ReLoginModal';
import { Init } from '../../utils/Init';

const PageTemplate = observer(({ children }) => {
  const { toastStore, modalStore } = useStores();
  const message = toastStore.message;

  // 안드로이드 공통함수
  const { test } = Init();

  // 안드로이드 공통함수 선언
  useEffect(() => {
    test();
  }, [test]);

  return (
    <>
      {!toastStore.hidden && <Toast message={message} />}
      <ModalContainer title='계정등록' hidden={modalStore.hidden} />
      <div className='container'>{children}</div>
      <BottomMenu />
      <style jsx>
        {`
          .container {
            height: 100%;
            padding-bottom: 100px;
            overflow-y: scroll;
          }

          .main {
            height: 100%;
            padding: 4rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </>
  );
});

const PageLayout = ({ children }) => <PageTemplate>{children}</PageTemplate>;

export default PageLayout;
