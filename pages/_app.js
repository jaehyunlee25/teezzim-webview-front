import Head from 'next/head';

import '@/styles/globals.scss';
import MobXStoresContext from '@/stores/MobXStoreContext.js';
import globalStore from '@/stores/globalStore';

export default function MyApp({ Component, pageProps }) {
  // 주입할 전역 MobX Store들
  const initStores = {
    globalStore,
  };

  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <title>TeeZZim</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MobXStoresContext.Provider value={initStores}>
        <Component {...pageProps} />
      </MobXStoresContext.Provider>
    </>
  );
}
