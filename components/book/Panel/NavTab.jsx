import { useMemo } from 'react';
import ChipButton from '@/components/common/ChipButton';
import { observer } from 'mobx-react-lite';
import useStores from '@/stores/useStores';

const NavTab = () => {
  const filterList = [
    '전체',
    '수도권',
    '강원도',
    '충청도',
    '영남권',
    '호남권',
    '제주도',
  ];

  return (
    <>
      <div className='container'>
        {/* SecArea 지역선택 */}
        <div className='SecArea'>
          <ul className='tab-list'>
            {filterList?.map(area => (
              <Tab
                key={area}
                name={area ?? '전체'}
                area={area === '전체' ? null : area}
              />
            ))}
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
      `}</style>
    </>
  );
};

export default NavTab;

const Tab = observer(({ name, area }) => {
  const { panelStore } = useStores();

  const status = useMemo(
    () =>
      panelStore.groupedCheckList?.[area] ??
      (area ? 0 : panelStore.checkedTeeList.size),
    [panelStore.groupedCheckList, panelStore.checkedTeeList, area],
  );

  const handleTabClick = () => {
    panelStore.setFilter(area);
  };

  return (
    <>
      <li>
        <ChipButton
          status={status}
          color={panelStore.filter === area ? 'active' : 'default'}
          onClick={handleTabClick}
        >
          {name}
        </ChipButton>
      </li>
      <style jsx>{`
        li {
          display: inline-block;
          margin: 0px 8px;
        }
      `}</style>
    </>
  );
});
