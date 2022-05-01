import Book from '@/components/layouts/book';
import useStores from '@/stores/useStores';
import { useRouter } from 'next/router';

export default function Home() {
  const { globalStore } = useStores();
  const router = useRouter();
  return (
    <>
      <Book />
    </>
  );
}
