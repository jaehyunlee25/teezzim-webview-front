import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import useStores from '@/stores/useStores';

const HomepageLink = observer(({ id, children, ...props }) => {
  const { panelStore } = useStores();

  const handleClick = e => {
    if (window) {
      const url = panelStore.teeListMap?.[id]?.homepage;
      const params = { id, url };
      /** WEB->APP */
      if (window.BRIDGE && window.BRIDGE.callHomepageLogin) {
        window.BRIDGE.callHomepageLogin(JSON.stringify(params));
      } else if (window.webkit && window.webkit.messageHandlers ) {
        const payload = JSON.stringify({
          command: 'callHomepageLogin',
          data: JSON.stringify(params),
        });
        window.webkit.messageHandlers.globalMethod.postMessage(payload);
      } else {
        alert(url)
      }
    }
  }

  return (
    <p
      className='text-link'
      style={{
        textOverflow: 'ellipsis',
        // maxWidth: 150,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <a
        {...props}
        onClick={handleClick}
      >
        {children}
        </a>
    </p>
  );
});

export default HomepageLink;
