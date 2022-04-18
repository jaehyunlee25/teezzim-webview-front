import { useState } from 'react';

const Filter = props => {
  const [region, setRegion] = useState(false);
  const [time, setTime] = useState(false);
  const [regionItems, setRegionItems] = useState({
    r1: false,
    r2: false,
    r3: false,
    r4: false,
    r5: false,
    r6: false,
  });
  const [timeItems, setTimeItems] = useState({
    t1: false,
    t2: false,
    t3: false,
    t4: false,
    t5: false,
  });

  const handleChecked = e => {
    const { id, value } = e.target;
    if (id.startsWith('sSwitch21')) {
      setRegion(!region);
    } else if (id.startsWith('sSwitch22')) {
      setTime(!time);
    } else if (id.startsWith('sCheck1')) {
      setRegionItems({ ...regionItems, [value]: !regionItems[value] });
    } else if (id.startsWith('sCheck2')) {
      setTimeItems({ ...timeItems, [value]: !timeItems[value] });
    }
  };

  return (
    <>
      <div
        id='tabContent02'
        // className='tab-content'
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
                  value='r1'
                  checked={regionItems.r1}
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
                  value='r2'
                  checked={regionItems.r2}
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
                  value='r3'
                  checked={regionItems.r3}
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
                  value='r4'
                  checked={regionItems.r4}
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
                  value='r5'
                  checked={regionItems.r5}
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
                  value='r6'
                  checked={regionItems.r6}
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
                    value='t1'
                    checked={timeItems.t1}
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
                    value='t2'
                    checked={timeItems.t2}
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
                    value='t3'
                    checked={timeItems.t3}
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
                    value='t4'
                    checked={timeItems.t4}
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
                    value='t5'
                    checked={timeItems.t5}
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
};

export default Filter;
