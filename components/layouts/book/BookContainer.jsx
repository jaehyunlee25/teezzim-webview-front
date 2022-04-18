const BookContainer = () => {
  // TODO TeeSchedule Store에 저장된 Schedule List 가져와서 렌더링하기
  // 일단 다 미등록으로 띄움

  return (
    <>
      {/* 데이터가 없을 때 
        <div className='inner-container'>
          <div className='no-data mt-50'>
            <p className='text-main'>예약 가능한 Tee-off가 없습니다.</p>
          </div>
        </div> */}
      <div className='inner-container'>
        <div className='time-head title-group'>
          <h1 className='head-headline'>
            신라CC<span className='bar'>서</span>
          </h1>
        </div>
        <div className='time-content'>
          <div className='time-row'>
            <h2 className='title-hour'>9시</h2>
            <div className='box-row'>
              <div className='min'>39</div>
              <div className='min'>46</div>
            </div>
          </div>
        </div>
      </div>
      <div className='inner-container'>
        <div className='time-head title-group'>
          <h1 className='head-headline'>
            청평마이다스<span className='bar'>Valley</span>
          </h1>
        </div>
        <div className='time-content'>
          <div className='time-row'>
            <h2 className='title-hour'>19시</h2>
            <div className='box-row multi'>
              <div className='min warning'>0</div>
              <div className='min warning'>7</div>
              <div className='min warning'>14</div>
              <div className='min warning'>28</div>
              <div className='min warning'>49</div>
              <div className='min warning'>56</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookContainer;
