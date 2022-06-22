import { useRouter } from 'next/router';

export default function GolfHomepage() {
  const router = useRouter();
  const { url } = router.query;

  return (
    <>
      <div className='container'>
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
        <iframe src={url} width='100%' height='100%' />
      </div>
      <style jsx>{`
        .container {
          padding-top: 44px;
          height: 100%;
        }
        #header {
          position: fixed;
          top: 0;
          z-index: 9999;
        }
      `}</style>
    </>
  );
}
