import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import useStores from '@/stores/useStores';

const MiniPanel = observer(({ setPanelHidden }) => {
  const router = useRouter();
  const { container } = router.query;
  const { panelStore } = useStores();

  const panelName = () => {
    if (container === 'book') return '실시간 예약';
    else if (container === 'wait') return '예약대기';
    else if (container === 'alarm') return '예약오픈 알림';
  };

  return (
    <>
      <div className='rollsheet-wrap' onClick={() => setPanelHidden(false)}>
        <div className='rollsheet-container'>
          <div className='rollsheet'>
            <h1 className='head-headline text-primary'>
              {panelName()}({panelStore.checkedTeeList.size}):
            </h1>
            <p className='text-sub'>
              {[...panelStore.checkedTeeList]
                ?.map(v => JSON.parse(v).name)
                .join(', ')}
            </p>
            <div className='handle'></div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .text-sub {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </>
  );
});

export default MiniPanel;
