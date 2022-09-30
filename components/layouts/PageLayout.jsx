import Toast from '@/components/common/Toast';
import BottomMenu from '@/components/layouts/BottomMenu';
import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import LoginModal from '../common/Modal/LoginModal';
import ModalContainer from '../common/Modal/ModalContainer';
import ReLoginModal from '../common/Modal/ReLoginModal';
import { useRouter } from 'next/router';

const PageTemplate = observer(({ children }) => {
  const router = useRouter();

  const { toastStore, modalStore } = useStores();
  const message = toastStore.message;

  return (
    <>
      {!toastStore.hidden && <Toast message={message} />}
      <ModalContainer hidden={modalStore.hidden} />
      <div className='container'>{children}</div>
      <BottomMenu />
      <style jsx>
        {`
          .container {
            height: 100%;
            padding-bottom: ${router.pathname.startsWith('/home') ? 100 : 0}px;
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
