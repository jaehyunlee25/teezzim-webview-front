import Book from '@/components/layouts/book';
import useStores from '@/stores/useStores';
import { useRouter } from 'next/router';
import Reserve from '@/pages/reserve';

export default function Home() {
  const { globalStore } = useStores();
  const router = useRouter();
  const { tab, ...others } = router?.query;
  // const renderContainer = () => {
  //   switch (tab) {
  //     case 'book':
  //       return <Book />;
  //     case 'my_book':
  //       return <Reserve />;
  //     default:
  //       return <Book />;
  //   }
  // };
  return <>{<Book />}</>;
}
