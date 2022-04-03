import BottomMenu from '@/components/layouts/BottomMenu';
import useStores from '@/stores/useStores';

export default function Home() {
  const { globalStore } = useStores();

  return (
    <>
      <div className='container'>
        <main className='main'>Hello TeeZZim {globalStore.isTest}</main>
      </div>
      <BottomMenu />
      <style jsx>
        {`
          .container {
            padding: 0 2rem;
          }

          .main {
            min-height: 100vh;
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
