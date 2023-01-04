import useStores from '@/stores/useStores';
import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import TeeItem from '@/components/book/BookContainer/TeeItem';
import { useRouter } from 'next/router';

const BookContainer = observer(() => {
  const router = useRouter();
  const { subTab } = router?.query ?? {};
  const { teeScheduleStore, loadStore, panelStore } = useStores();
  const registeredTee = useMemo(() => {
    return Object.entries(teeScheduleStore.currentTeeSchedules)
      .filter(
        ([tee_id, schedules]) =>
          panelStore.registeredKeys.includes(tee_id) &&
          Object.keys(schedules).length > 0 &&
          teeScheduleStore.areas.includes(panelStore.teeListMap?.[tee_id].area),
      )
      .sort((a, b) => {
        const [aName, bName] = [
          panelStore.teeListMap[a[0]].name,
          panelStore.teeListMap[b[0]].name,
        ];
        return aName < bName ? -1 : aName > bName ? 1 : 0;
      });
  }, [
    teeScheduleStore.currentTeeSchedules,
    panelStore.registeredKeys,
    teeScheduleStore.areas,
    panelStore.teeListMap,
  ]);

  // const unregisteredTee = useMemo(() => {
  //   return Object.entries(teeScheduleStore.currentTeeSchedules)
  //     .filter(
  //       ([tee_id, schedules]) =>
  //         !panelStore.registeredKeys.includes(tee_id) &&
  //         Object.keys(schedules).length > 0 &&
  //         teeScheduleStore.areas.includes(panelStore.teeListMap?.[tee_id].area),
  //     )
  //     .sort((a, b) => {
  //       const [aName, bName] = [
  //         panelStore.teeListMap[a[0]].name,
  //         panelStore.teeListMap[b[0]].name,
  //       ];
  //       return aName < bName ? -1 : aName > bName ? 1 : 0;
  //     });
  // }, [
  //   teeScheduleStore.currentTeeSchedules,
  //   panelStore.registeredKeys,
  //   teeScheduleStore.areas,
  //   panelStore.teeListMap,
  // ]);

  return (
    <>
      {/** 데이터가 없을 때 */}
      <div>
        {loadStore.isLoading ? (
          <div className='loading-icon'></div>
        ) : teeScheduleStore.isEmpty ||
          (registeredTee.length === 0 ) ? (
          // (registeredTee.length === 0 && unregisteredTee.length === 0) ? (
          <div className='no-data mt-50'>
            <p className='text-main'>
              {/* {subTab === 'tabContent01'
                ? '예약 가능한 Tee-off가 없습니다.'
                : '고급 필터와 일치하는 골프장이 없습니다.'} */}
            </p>
          </div>
        ) : (
          <>
            {registeredTee.map(([tee_id, schedules], i) => (
              <TeeItem
                key={'registered' + i + tee_id}
                id={tee_id}
                name={panelStore.teeListMap?.[tee_id].name}
                area={panelStore.teeListMap?.[tee_id].area}
                schedules={schedules}
                registered
                isLast={i === registeredTee.length-1}
              />
            ))}
            {/* {unregisteredTee.map(([tee_id, schedules], i) => (
              <TeeItem
                key={'unregistered' + i + tee_id}
                id={tee_id}
                name={panelStore.teeListMap?.[tee_id].name}
                area={panelStore.teeListMap?.[tee_id].area}
                schedules={schedules}
              />
            ))} */}
          </>
        )}
      </div>
      <style jsx>{`
        .loading-icon {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
          margin-top: 60px;
          width: 40px;
          height: 40px;
        }
      `}</style>
    </>
  );
});

export default BookContainer;
