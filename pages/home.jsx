import SearchContainer from '@/components/book/Panel/SearchContainer';
import ChipButton from '@/components/common/ChipButton';
import SearchBar from '@/components/common/SearchBar';
import Toast from '@/components/common/Toast';
import Book from '@/components/layouts/book';
import BottomMenu from '@/components/layouts/BottomMenu';
import useStores from '@/stores/useStores';
import { useRouter } from 'next/router';
import Reserve from '@/pages/reserve';

export default function Home() {
  const { globalStore } = useStores();
  const router = useRouter();
  const { tab, ...others } = router?.query;
  const renderContainer = () => {
    switch (tab) {
      case 'book':
        return <Book />;
      case 'my_book':
        return <Reserve />;
      default:
        return <Book />;
    }
  };
  return (
    <>
      <div className='container'>{renderContainer()}</div>

      {/* <Toast message='골프장을 1개 이상 선택해 주세요.' /> */}
      <BottomMenu />
      <style jsx>
        {`
          .container {
            height: 100%;
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
}
