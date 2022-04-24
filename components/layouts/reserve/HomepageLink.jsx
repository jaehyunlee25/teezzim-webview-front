import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import useStores from '@/stores/useStores';

const HomepageLink = observer(({ id, children, ...props }) => {
  const { panelStore } = useStores();
  const url = panelStore.teeListMap?.[id]?.homepage;
  return (
    <li className='text-link'>
      <Link href={{ pathname: '/golf_homepage/[url]', query: { url } }}>
        <a {...props}>{children}</a>
      </Link>
    </li>
  );
});

export default HomepageLink;
