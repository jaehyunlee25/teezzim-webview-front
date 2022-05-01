import useStores from '@/stores/useStores';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';

const FilterComponent = observer(props => {
  const { teeScheduleStore } = useStores();

  const [region, setRegion] = useState(true);
  const [time, setTime] = useState(true);

  const initialRegionItems = {
    수도권: teeScheduleStore.areas.includes('수도권'),
    강원도: teeScheduleStore.areas.includes('강원도'),
    충청도: teeScheduleStore.areas.includes('충청도'),
    영남권: teeScheduleStore.areas.includes('영남권'),
    호남권: teeScheduleStore.areas.includes('호남권'),
    제주도: teeScheduleStore.areas.includes('제주도'),
  };

  const initialTimeItems = {
    '5,6':
      new Set([...teeScheduleStore.times, 5, 6]).size ===
      teeScheduleStore.times.length,
    '7,8':
      new Set([...teeScheduleStore.times, 7, 8]).size ===
      teeScheduleStore.times.length,
    '11,12':
      new Set([...teeScheduleStore.times, 11, 12]).size ===
      teeScheduleStore.times.length,
    '13,14,15,16,17,18,19,20':
      new Set([...teeScheduleStore.times, 13, 14, 15, 16, 17, 18, 19, 20])
        .size === teeScheduleStore.times.length,
    '21,22,23,0,1,2,3,4':
      new Set([...teeScheduleStore.times, 21, 22, 23, 0, 1, 2, 3, 4]).size ===
      teeScheduleStore.times.length,
  };

  const [regionItems, setRegionItems] = useState(initialRegionItems);
  const [timeItems, setTimeItems] = useState(initialTimeItems);

  const handleChecked = e => {
    const { id, value } = e.target;
    let areas, times;
    if (id.startsWith('sSwitch21')) {
      setRegion(!region);
    } else if (id.startsWith('sSwitch22')) {
      setTime(!time);
    } else if (id.startsWith('sCheck1')) {
      areas = [value];
      regionItems[value]
        ? teeScheduleStore.removeAreas(areas)
        : teeScheduleStore.addAreas(areas);
      setRegionItems({ ...regionItems, [value]: !regionItems[value] });
    } else if (id.startsWith('sCheck2')) {
      times = value.split(',').map(time => Number(time));
      timeItems[value]
        ? teeScheduleStore.removeTimes(times)
        : teeScheduleStore.addTimes(times);
      setTimeItems({ ...timeItems, [value]: !timeItems[value] });
    }
    // console.log(teeScheduleStore.times);
    // console.log(teeScheduleStore.areas);
  };

  return (
    <>
      <div
        id='tabContent02'
        role='tabpanel'
        aria-labelledby='tabNav02'
        aria-hidden='false'
        {...props}
      >
        <div className='form type-row'>
          <div className='title-group'>
            <h2 className='text-main'>표시 지역</h2>
            <div className='switch'>
              <input
                type='checkbox'
                name='sSwitch2'
                id='sSwitch21'
                value='region'
                checked={region}
                onChange={handleChecked}
              />
              <label className='onoff-switch' htmlFor='sSwitch21'>
                <span className='offscreen'></span>
              </label>
            </div>
          </div>
          <div className='form-content'>
            <div className='col-group col-3 space'>
              <div className='check-box round'>
                <input
                  type='checkbox'
                  name='sCheck11'
                  id='sCheck11'
                  value='수도권'
                  checked={regionItems.수도권}
                  onChange={handleChecked}
                  disabled={!region}
                />
                <label htmlFor='sCheck11'>
                  <span>수도권</span>
                </label>
              </div>
              <div className='check-box round'>
                <input
                  type='checkbox'
                  name='sCheck12'
                  id='sCheck12'
                  value='강원도'
                  checked={regionItems.강원도}
                  onChange={handleChecked}
                  disabled={!region}
                />
                <label htmlFor='sCheck12'>
                  <span>강원도</span>
                </label>
              </div>
              <div className='check-box round'>
                <input
                  type='checkbox'
                  name='sCheck13'
                  id='sCheck13'
                  value='충청도'
                  checked={regionItems.충청도}
                  onChange={handleChecked}
                  disabled={!region}
                />
                <label htmlFor='sCheck13'>
                  <span>충청도</span>
                </label>
              </div>
            </div>
            <div className='col-group col-3 space mt-10'>
              <div className='check-box round'>
                <input
                  type='checkbox'
                  name='sCheck14'
                  id='sCheck14'
                  value='영남권'
                  checked={regionItems.영남권}
                  onChange={handleChecked}
                  disabled={!region}
                />
                <label htmlFor='sCheck14'>
                  <span>영남권</span>
                </label>
              </div>
              <div className='check-box round'>
                <input
                  type='checkbox'
                  name='sCheck15'
                  id='sCheck15'
                  value='호남권'
                  checked={regionItems.호남권}
                  onChange={handleChecked}
                  disabled={!region}
                />
                <label htmlFor='sCheck15'>
                  <span>호남권</span>
                </label>
              </div>
              <div className='check-box round'>
                <input
                  type='checkbox'
                  name='sCheck16'
                  id='sCheck16'
                  value='제주도'
                  checked={regionItems.제주도}
                  onChange={handleChecked}
                  disabled={!region}
                />
                <label htmlFor='sCheck16'>
                  <span>제주도</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className='form type-row'>
          <div className='title-group'>
            <h2 className='text-main'>시간대</h2>
            <div className='switch'>
              <input
                type='checkbox'
                name='sSwitch2'
                id='sSwitch22'
                value='time'
                checked={time}
                onChange={handleChecked}
              />
              <label className='onoff-switch' htmlFor='sSwitch22'>
                <span className='offscreen'></span>
              </label>
            </div>
          </div>
          <div className='form-content'>
            <ul className='option-group-list col-group col-5 space'>
              <li>
                <div className='check-box round row'>
                  <input
                    type='checkbox'
                    name='sCheck21'
                    id='sCheck21'
                    value='5,6'
                    checked={timeItems['5,6']}
                    onChange={handleChecked}
                    disabled={!time}
                  />
                  <label htmlFor='sCheck21' className='time'>
                    <span className='text-r'>
                      오전 5시
                      <br /> ~ 7시
                    </span>
                  </label>
                </div>
              </li>
              <li>
                <div className='check-box round row'>
                  <input
                    type='checkbox'
                    name='sCheck22'
                    id='sCheck22'
                    value='7,8'
                    checked={timeItems['7,8']}
                    onChange={handleChecked}
                    disabled={!time}
                  />
                  <label htmlFor='sCheck22' className='time'>
                    <span className='text-r'>
                      오전 7시
                      <br /> ~ 9시
                    </span>
                  </label>
                </div>
              </li>
              <li>
                <div className='check-box round row'>
                  <input
                    type='checkbox'
                    name='sCheck23'
                    id='sCheck23'
                    value='11,12'
                    checked={timeItems['11,12']}
                    onChange={handleChecked}
                    disabled={!time}
                  />
                  <label htmlFor='sCheck23' className='time'>
                    <span className='text-r'>
                      오전 11시
                      <br /> ~ 1시
                    </span>
                  </label>
                </div>
              </li>
              <li>
                <div className='check-box round row'>
                  <input
                    type='checkbox'
                    name='sCheck24'
                    id='sCheck24'
                    value='13,14,15,16,17,18,19,20'
                    checked={timeItems['13,14,15,16,17,18,19,20']}
                    onChange={handleChecked}
                    disabled={!time}
                  />
                  <label htmlFor='sCheck24' className='time'>
                    <span className='text-r'>
                      오후 1시
                      <br /> ~ 이후
                    </span>
                  </label>
                </div>
              </li>
              <li>
                <div className='check-box round row'>
                  <input
                    type='checkbox'
                    name='sCheck25'
                    id='sCheck25'
                    value='21,22,23,0,1,2,3,4'
                    checked={timeItems['21,22,23,0,1,2,3,4']}
                    onChange={handleChecked}
                    disabled={!time}
                  />
                  <label htmlFor='sCheck25' className='time'>
                    <span className='text-r'>
                      야간
                      <br /> ~
                    </span>
                  </label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <style jsx>{`
        .form.type-row {
          padding: 12px 8px;
        }
        .title-group {
          justify-content: normal;
          gap: 8px;
        }
      `}</style>
    </>
  );
});

const Filter = props => <FilterComponent {...props} />;
export default Filter;
