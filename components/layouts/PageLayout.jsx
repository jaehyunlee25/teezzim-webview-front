import Toast from '@/components/common/Toast';
import BottomMenu from '@/components/layouts/BottomMenu';
import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';

const PageTemplate = observer(({ children }) => {
  const { toastStore } = useStores();
  const message = toastStore.message;
  return (
    <>
      {!toastStore.hidden && <Toast message={message} />}
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
