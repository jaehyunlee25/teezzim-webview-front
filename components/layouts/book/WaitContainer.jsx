const WaitContainer = () => {
  return (
    <>
      <div className='component-wrap time-select'>
        <div className='inner-container'>
          <div className='time-head title-group'>
            <h1 className='head-headline'>라운딩 희망시간:</h1>
          </div>
          <div className='form type-row'>
            <div className='form-content'>
              <ul className='option-group-list col-group col-5 space'>
                <li>
                  <div className='check-box round row'>
                    <input
                      type='checkbox'
                      name='sCheck21'
                      id='sCheck21'
                      value='00:05:00-00:07:00'
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
                      value='00:07:00-00:09:00'
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
                      value='00:11:00~00:13:00'
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
                      value='00:13:00~00:07:00'
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
                      value=''
                    />
                    <label htmlFor='sCheck25' className='time'>
                      <span className='text-c'>
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
      </div>

      <div className='component-wrap'>
        <div className='inner-container'>
          <div className='btn-group'>
            <button type='button' className='btn large wide round primary'>
              예약대기 만들기
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .btn-group {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default WaitContainer;
