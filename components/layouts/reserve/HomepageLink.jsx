import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import useStores from '@/stores/useStores';

const HomepageLink = observer(({ id, children, ...props }) => {
  const { panelStore } = useStores();
  const url = panelStore.teeListMap?.[id]?.homepage;
  return (
    <p
      className='text-link'
      style={{
        textOverflow: 'ellipsis',
        maxWidth: 150,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <Link href={{ pathname: '/golf_homepage/[url]', query: { url } }}>
        <a {...props}>{children}</a>
      </Link>
    </p>
  );
});

export default HomepageLink;
