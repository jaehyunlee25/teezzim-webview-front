import Head from 'next/head';

import '@/styles/globals.scss';
import '@/styles/layout.scss';
import '@/styles/tzapp.scss';
import '@/styles/app.scss';

import MobXStoresContext from '@/stores/MobXStoreContext.js';
import globalStore from '@/stores/globalStore';
import panelStore from '@/stores/panelStore';
import teeScheduleStore from '@/stores/teeScheduleStore';
import loadStore from '@/stores/loadStore';
import authStore from '@/stores/authStore';
import toastStore from '@/stores/toastStore';
import modalStore from '@/stores/modalStore';
import reserveTabStore from '@/stores/reserveTabStore';

import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';
import PageLayout from '@/components/layouts/PageLayout';
import { useEffect, useState } from 'react';
import { sendResponse } from '@/lib/APIUtils';
import ErrorBoundary from './ErrorBoundary';
import Survey from './Survey';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isSurvey, setIsSurvey] = useState(false);
  
  useEffect(() => storePathValues, [router.asPath]);
  useEffect(() => {
    if(window){
      const surveyData = window.localStorage.getItem('isSurvey');
      if(surveyData){
        setIsSurvey(true);
      } 
      window.getNativeRequest = function (parameter) {
        sendResponse(parameter);
      };
    }
  }, []);

  function storePathValues() {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;
    // Set the previous path as the value of the current path.
    const prevPath = storage.getItem('currentPath');
    storage.setItem('prevPath', prevPath);
    // Set the current path value by looking at the browser's location object.
    storage.setItem('currentPath', globalThis.location.pathname);
  }
  // 주입할 전역 MobX Store들
  const initStores = {
    globalStore,
    panelStore,
    teeScheduleStore,
    loadStore,
    authStore,
    toastStore,
    modalStore,
    reserveTabStore,
  };

  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
        <meta httpEquiv='Cache-Control' content='No-Cache' />
        <meta httpEquiv='Pragma' content='No-Cache' />
        <meta httpEquiv='Expires' content='-1' />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <title>TeeZZim</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <SWRConfig value={{ fetcher: url => fetch(url).then(res => res.json()) }}>
        <MobXStoresContext.Provider value={initStores}>
          <div id='app' className='wrap'>
            <ErrorBoundary>
              {
                isSurvey ?
                  <PageLayout>
                    <Component {...pageProps} />
                  </PageLayout>
                  :
                  <Survey />
              }
            </ErrorBoundary>
          </div>
        </MobXStoresContext.Provider>
      </SWRConfig>
    </>
  );
}
