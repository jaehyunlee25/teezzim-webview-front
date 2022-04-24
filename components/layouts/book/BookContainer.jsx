import useStores from '@/stores/useStores';
import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import TeeItem from '@/components/book/BookContainer/TeeItem';

const BookContainer = observer(() => {
  const { teeScheduleStore, loadStore, panelStore } = useStores();

  const registeredTee = useMemo(() => {
    return Object.entries(teeScheduleStore.currentTeeSchedules).filter(
      ([tee_id, _]) =>
        panelStore.registeredKeys.includes(tee_id) &&
        teeScheduleStore.areas.includes(panelStore.teeListMap?.[tee_id].area),
    );
  }, [
    teeScheduleStore.currentTeeSchedules,
    panelStore.registeredKeys,
    teeScheduleStore.areas,
    panelStore.teeListMap,
  ]);

  const unregisteredTee = useMemo(() => {
    return Object.entries(teeScheduleStore.currentTeeSchedules).filter(
      ([tee_id, _]) =>
        !panelStore.registeredKeys.includes(tee_id) &&
        teeScheduleStore.areas.includes(panelStore.teeListMap?.[tee_id].area),
    );
  }, [
    teeScheduleStore.currentTeeSchedules,
    panelStore.registeredKeys,
    teeScheduleStore.areas,
    panelStore.teeListMap,
  ]);

  return (
    <>
      {/** 데이터가 없을 때 */}
      <div className='inner-container'>
        {loadStore.isLoading ? (
          <div className='loading-icon'></div>
        ) : teeScheduleStore.isEmpty ||
          (registeredTee.length === 0 && unregisteredTee.length === 0) ? (
          <div className='no-data mt-50'>
            <p className='text-main'>
              {registeredTee.length === 0 && unregisteredTee.length === 0
                ? '선택하신 지역에 '
                : null}
              예약 가능한 Tee-off가 없습니다.
            </p>
          </div>
        ) : (
          <>
            {registeredTee.map(([tee_id, schedules], i) => (
              <TeeItem
                key={'registered' + tee_id + i}
                id={tee_id}
                name={panelStore.teeListMap?.[tee_id].name}
                area={panelStore.teeListMap?.[tee_id].area}
                schedules={schedules}
                registered
              />
            ))}
            {unregisteredTee.map(([tee_id, schedules], i) => (
              <TeeItem
                key={'unregistered' + tee_id + i}
                id={tee_id}
                name={panelStore.teeListMap?.[tee_id].name}
                area={panelStore.teeListMap?.[tee_id].area}
                schedules={schedules}
              />
            ))}
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
