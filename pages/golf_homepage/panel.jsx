import Panel from '@/components/layouts/golf_homepage/Panel';
import { useRouter } from 'next/router';
export default function GolfHomepagePanel() {
  const router = useRouter();
  return (
    <>
      <div id='header'>
        <button
          type='button'
          className='btn-history-back'
          onClick={() => router.back()}
        >
          <span className='offscreen'>이전</span>
        </button>
        <h1 className='headline'>골프장 홈페이지</h1>
      </div>
      <Panel />
      <style jsx>{`
        #header {
          position: fixed;
          top: 0;
          z-index: 9999;
        }
      `}</style>
    </>
  );
}
