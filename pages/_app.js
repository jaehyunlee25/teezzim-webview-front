import Head from 'next/head';

import '@/styles/globals.scss';
import '@/styles/layout.scss';
import '@/styles/tzapp.scss';
import MobXStoresContext from '@/stores/MobXStoreContext.js';
import globalStore from '@/stores/globalStore';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // 주입할 전역 MobX Store들
  const initStores = {
    globalStore,
  };

  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
        <meta httpEquiv='Cache-Control' content='No-Cache' />
        <meta httpEquiv='Pragma' content='No-Cache' />
        <meta httpEquiv='Expires' content='-1' />
        <title>TeeZZim</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MobXStoresContext.Provider value={initStores}>
        <Component {...pageProps} />
      </MobXStoresContext.Provider>
    </>
  );
}
