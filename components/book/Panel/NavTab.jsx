import { useState } from 'react';
import ChipButton from '@/components/common/ChipButton';

export default function NavTab() {
  const initialState = {
    area0: { status: 1, active: true },
    area1: { status: 0, active: false },
    area2: { status: 0, active: false },
    area3: { status: 1, active: false },
    area4: { status: 0, active: false },
    area5: { status: 0, active: false },
  };
  const [tabStatus, setTabStatus] = useState(initialState);
  const { area0, area1, area2, area3, area4, area5 } = tabStatus;
  const handleTabClick = e => {
    const { id } = e.target;
    if (!id) return;

    const target = tabStatus[id];
    if (id !== 'area0') {
      setTabStatus({
        ...tabStatus,
        [id]: { ...target, active: !target.active },
        area0: { ...area0, active: false },
      });
    } else {
      setTabStatus({
        ...tabStatus,
        [id]: { ...target, active: !target.active },
        area1: { ...area1, active: false },
        area2: { ...area2, active: false },
        area3: { ...area3, active: false },
        area4: { ...area4, active: false },
        area5: { ...area5, active: false },
      });
    }
  };
  return (
    <>
      <div className='container'>
        {/* SecArea 지역선택 */}
        <div className='SecArea'>
          <ul className='tab-list'>
            <li>
              <ChipButton
                id='area0'
                status={area0.status}
                color={area0.active ? 'active' : 'default'}
                onClick={handleTabClick}
              >
                전체
              </ChipButton>
            </li>
            <li>
              <ChipButton
                id='area1'
                status={area1.status}
                color={area1.active ? 'active' : 'default'}
                onClick={handleTabClick}
              >
                수도권
              </ChipButton>
            </li>
            <li>
              <ChipButton
                id='area2'
                status={area2.status}
                color={area2.active ? 'active' : 'default'}
                onClick={handleTabClick}
              >
                충청도
              </ChipButton>
            </li>
            <li>
              <ChipButton
                id='area3'
                status={area3.status}
                color={area3.active ? 'active' : 'default'}
                onClick={handleTabClick}
              >
                강원도
              </ChipButton>
            </li>
            <li>
              <ChipButton
                id='area4'
                status={area4.status}
                color={area4.active ? 'active' : 'default'}
                onClick={handleTabClick}
              >
                영남권
              </ChipButton>
            </li>
            <li>
              <ChipButton
                id='area5'
                status={area5.status}
                color={area5.active ? 'active' : 'default'}
                onClick={handleTabClick}
              >
                호남권
              </ChipButton>
            </li>
          </ul>
          {/* //SecArea 지역선택  */}
        </div>
      </div>
      <style jsx>{`
        .container {
          overflow-x: hidden;
          overflow-y: auto;
          display: flex;
          background-color: var(--neutrals-white);
          padding-top: 60px;
        }

        .SecArea {
          border-bottom: 2px solid rgba(120, 128, 128, 0.16);
          height: max-content;
          width: 100%;
          overflow-x: scroll;
        }

        .SecArea::-webkit-scrollbar {
          display: none;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        ul.tab-list {
          width: max-content;
          margin: 0px 16px;
          height: 100%;
        }

        ul.tab-list > li {
          display: inline-block;
          margin: 0px 8px;
        }
      `}</style>
    </>
  );
}
