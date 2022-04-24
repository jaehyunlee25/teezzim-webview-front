import Toast from '@/components/common/Toast';
import BottomMenu from '@/components/layouts/BottomMenu';

const PageLayout = ({ children }) => {
  return (
    <>
      <div className='container'>{children}</div>

      {/* <Toast message='골프장을 1개 이상 선택해 주세요.' hidden={true} /> */}
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
};

export default PageLayout;
