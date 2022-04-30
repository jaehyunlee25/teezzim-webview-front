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

const AlarmContainer = () => {
  const filterList = [
    '전체',
    '수도권',
    '강원도',
    '충청도',
    '영남권',
    '호남권',
    '제주도',
  ];

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

  const handleAlarmButton = e => {
    if (window) {
      /** 예약하기 탭 열림완료 WEB->APP 전송 */
      if (window.BRIDGE && window.BRIDGE.saveOpenAlarmList) {
          // 앱에 보내줄 데이터 형식
          const dataSample = [
            { 
              clubId: "골프장id",
              waitDate: "예약일",
              waitTime: "예약시간",
            },
            // ... 체크된 갯수만큼 반복
          ];
          const jsonStr = JSON.stringify(dataSample);
          window.BRIDGE.saveOpenAlarmList(jsonStr);
      }
    }
  }

  return (
    <>
      <div className='list_AreaTop'>
        <span>
          선택한 골프장:<b>5</b>
        </span>
        <span className='fr'>
          골프장 수:<b>40</b>
        </span>
      </div>

      <div className='SecArea'>
        <ul className='tab-list'>
          {filterList?.map(v => (
            <li key={v}>
              <ChipButton status={1} bColor={'var(--neutrals-grey-4)'}>
                {v}
              </ChipButton>
            </li>
          ))}
        </ul>
      </div>

      <div className='area_check'>
        <section className='nav_scroll_wrap'>
          <ul className='area_tablist'>
            <TeeAlarmCard
              id={1}
              name='남춘천CC'
              img={capList[0].src}
              openData={4}
              registered
            />
            <TeeAlarmCard
              id={1}
              name='아일랜드CC'
              img={capList[2].src}
              openData={11}
              registered
            />
            <li className='divider'>
              <span className='linebar'></span>
            </li>
            <TeeAlarmCard
              id={1}
              name='라비에벨'
              img={capList[3].src}
              openData={4}
            />
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
      <style jsx>{`
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
};

export default AlarmContainer;

const TeeAlarmCard = ({ registered = false, id, img, name, openData }) => {
  return (
    <>
      <li>
        <div className='checkbg'>
          <div className='area_bg'></div>
          <div className='check-box round'>
            <input type='checkbox' id={id} name='cks' value='1' />
            <label htmlFor={id}></label>
          </div>
          <div className='area_info'>
            <span>{name}</span>
            <span className='open_date'>{openData}일 오픈</span>
          </div>
        </div>
      </li>
      <style jsx>{`
        li {
          width: 66px;
          margin: 0px 4px;
        }
        .checkbg {
          background-color: ${registered ? '#fff' : '#f9eff1'};
          width: 100%;
        }
        .area_bg {
          background: url(${img}) no-repeat;
          background-size: contain;
          width: 100%;
          margin: 0px;
        }
        .area_info {
          text-align: center;
        }
        .open_data {
          left: 50%;
          transform: translate(-50%, 0);
        }
      `}</style>
    </>
  );
};
