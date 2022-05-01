import ChipButton from '@/components/common/ChipButton';
import Divider from '@/assets/images/temp/Checkbox_Atoms_V3.svg';
import Cap01 from '@/assets/images/temp/Cap01.svg';
import Cap02 from '@/assets/images/temp/Cap02.svg';
import Cap03 from '@/assets/images/temp/Cap03.svg';
import Cap04 from '@/assets/images/temp/Cap04.svg';
import Cap05 from '@/assets/images/temp/Cap05.svg';
import Cap06 from '@/assets/images/temp/Cap06.svg';
import Cap07 from '@/assets/images/temp/Cap07.svg';
import Cap08 from '@/assets/images/temp/Cap08.svg';
import Cap09 from '@/assets/images/temp/Cap09.svg';
import Cap10 from '@/assets/images/temp/Cap10.svg';
import { observer } from 'mobx-react-lite';
import { useState, useMemo, useEffect } from 'react';
import useStores from '@/stores/useStores';
import { getDay } from '@/lib/DateUtils';

const AlarmContainerComponent = observer(() => {
  const { panelStore, teeScheduleStore, loadStore, toastStore } = useStores();

  const filterList = [
    '전체',
    '수도권',
    '강원도',
    '충청도',
    '영남권',
    '호남권',
    '제주도',
  ];

  const [filter, setFilter] = useState('전체');
  const initialChipStatus = filterList.reduce(
    (acc, v) => ({ ...acc, [v]: 0 }),
    {},
  );
  const [chipStatus, setChipStatus] = useState(initialChipStatus);

  const [alarmData, setAlarmData] = useState([]);

  /** Tee Checkbox Handler */
  const handleCheck = e => {
    const { id, value } = e.target;
    if (!id) return;
    if (alarmData.includes(id)) {
      setAlarmData(alarmData.filter(v => v !== id));
      setChipStatus({ ...chipStatus, [value]: chipStatus?.[value] - 1 });
    } else {
      setAlarmData([...alarmData, id]);
      setChipStatus({ ...chipStatus, [value]: chipStatus?.[value] + 1 });
    }
  };

  /** Toast에 필요한 데이터 형식 */
  const currentDate = teeScheduleStore.date;
  const [_, mon, date] = currentDate.split('-');
  const day = getDay(currentDate);

  /** 예약 오픈 Checkbox에 필요한 List */
  const alarmTeeList = useMemo(() => {
    const noScheduleTee = Object.entries(
      teeScheduleStore.currentTeeSchedules ?? {},
    )
      .filter(([_, schedules]) => Object.keys(schedules ?? {}).length === 0)
      .map(([tee_id, _]) => tee_id);
    return [...panelStore.checkedTeeList]
      .map(v => JSON.parse(v))
      .filter(v => noScheduleTee.includes(v.id));
  }, [teeScheduleStore.currentTeeSchedules, panelStore.checkedTeeList]);

  const registeredList = useMemo(
    () =>
      alarmTeeList.filter(
        v =>
          panelStore.registeredKeys.includes(v.id) &&
          (filter === '전체' || filter === v.area),
      ),
    [alarmTeeList, panelStore.registeredKeys, filter],
  );

  const unregisteredList = useMemo(
    () =>
      alarmTeeList.filter(
        v =>
          !panelStore.registeredKeys.includes(v.id) &&
          (filter === '전체' || filter === v.area),
      ),
    [alarmTeeList, panelStore.registeredKeys, filter],
  );

  const handleAlarmButton = e => {
    if (window) {
      /** 예약하기 탭 열림완료 WEB->APP 전송 */
      if (window.BRIDGE && window.BRIDGE.saveOpenAlarmList) {
        // 앱에 보내줄 데이터 형식
        // const dataSample = [
        //   {
        //     clubId: '골프장id',
        //     alarmDate: '예약일',
        //   },
        //   // ... 체크된 갯수만큼 반복
        // ];
        const data = alarmData.map(v => ({
          clubId: v,
          alarmDate: currentDate,
        }));
        console.log(data);
        const jsonStr = JSON.stringify(data);
        window.BRIDGE.saveOpenAlarmList(jsonStr);
      }
      toastStore.setMessage(
        <>
          {mon}월 {date}일 ({day}요일) {alarmData.length}개 골프장에
          <br />
          예약오픈 알림을 만들었습니다.
        </>,
      );
      toastStore.setHidden(false);
    }
  };

  useEffect(() => {
    /** 날짜 바뀔때마다 status 초기화 */
    setAlarmData([]);
    setChipStatus(initialChipStatus);
  }, [currentDate]);

  return (
    <>
      {loadStore.isLoading ? (
        <div className='loading-icon'></div>
      ) : (
        <>
          <div className='list_AreaTop'>
            <span>
              선택한 골프장:<b>{alarmData.length}</b>
            </span>
            <span className='fr'>
              골프장 수:<b>{alarmTeeList.length}</b>
            </span>
          </div>

          <div className='SecArea'>
            <ul className='tab-list'>
              {filterList?.map(v => (
                <li key={v}>
                  <ChipButton
                    status={
                      v === '전체' ? alarmData.length : chipStatus?.[v] ?? 0
                    }
                    color={filter === v ? 'active' : 'default'}
                    bColor={'var(--neutrals-grey-4)'}
                    onClick={() => setFilter(v)}
                  >
                    {v}
                  </ChipButton>
                </li>
              ))}
            </ul>
          </div>

          <div className='area_check'>
            <section className='nav_scroll_wrap'>
              <ul className='area_tablist'>
                {registeredList.map((v, i) => (
                  <TeeAlarmCard
                    key={v.id}
                    id={v.id}
                    name={v.name}
                    area={v.area}
                    img={capList[i % 10]}
                    checked={alarmData.includes(v.id)}
                    handleCheck={handleCheck}
                    registered
                  />
                ))}
                {registeredList.length > 0 && unregisteredList.length > 0 ? (
                  <li className='divider'>
                    <span className='linebar'></span>
                  </li>
                ) : null}
                {unregisteredList.map((v, i) => (
                  <TeeAlarmCard
                    key={v.id}
                    id={v.id}
                    name={v.name}
                    area={v.area}
                    img={capList[i % 10]}
                    checked={alarmData.includes(v.id)}
                    handleCheck={handleCheck}
                  />
                ))}
              </ul>
            </section>
          </div>

          <div className='component-wrap'>
            <div className='inner-container'>
              <div className='btn-group'>
                <button
                  type='button'
                  className='btn large wide round primary'
                  onClick={handleAlarmButton}
                >
                  예약오픈 알림 받기
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <style jsx>{`
        .loading-icon {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
          margin-top: 60px;
          width: 40px;
          height: 40px;
        }
        .fr {
          background: transparent;
          color: inherit;
        }

        .list_AreaTop {
          background: transparent;
        }

        .SecArea {
          background: transparent;
          height: 100%;
          width: 100%;
          overflow-x: scroll;
        }

        .SecArea::-webkit-scrollbar {
          display: none;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .component-wrap {
          margin-top: 16px;
        }

        button {
          padding: 0px 15px;
        }

        ul.tab-list {
          width: max-content;
          margin: 0px 12px;
          height: 100%;
        }

        li {
          display: inline-block;
          margin: 0px 4px;
        }
        li.divider {
          width: max-content;
        }
        .linebar {
          background: url(${Divider.src}) center center no-repeat;
          margin: 0px;
        }

        .btn-group {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  );
});

const AlarmContainer = () => <AlarmContainerComponent />;
export default AlarmContainer;

const TeeAlarmCard = ({
  registered = false,
  id,
  img,
  name,
  area,
  openData,
  checked,
  handleCheck,
}) => {
  return (
    <>
      <li>
        <div className='checkbg'>
          <div className='area_bg'></div>
          <div className='check-box round'>
            <input
              type='checkbox'
              id={id}
              name={name}
              value={area}
              checked={checked}
              onChange={handleCheck}
            />
            <label htmlFor={id}></label>
          </div>
          <div className='area_info'>
            <span>
              {name.length <= 6 ? (
                name
              ) : (
                <>
                  {name.substring(0, 5)}
                  <br />
                  {name.substring(5)}
                </>
              )}
            </span>
            {/* <span className='open_date'>{openData}일 오픈</span> */}
          </div>
        </div>
      </li>
      <style jsx>{`
        li {
          width: 68px;
          margin: 0px 4px;
        }
        .checkbg {
          background-color: ${registered ? '#fff' : '#f9eff1'};
          width: 100%;
        }
        .area_bg {
          background: url(${img.src}) no-repeat;
          background-size: contain;
          width: 100%;
          margin: 0px;
        }
        .area_info {
          text-align: center;
          display: flex;
          justify-content: center;
          width: 66px;
          height: calc(100% - 54px);
        }
        .area_info > span {
          overflow-wrap: break-word;
          word-break: break-all;
          display: block;
        }
        .open_data {
          left: 50%;
          transform: translate(-50%, 0);
        }
      `}</style>
    </>
  );
};

const capList = [
  Cap01,
  Cap02,
  Cap03,
  Cap04,
  Cap05,
  Cap06,
  Cap07,
  Cap08,
  Cap09,
  Cap10,
];
