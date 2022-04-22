import ChipButton from '@/components/common/ChipButton';
import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';

const CheckController = observer(({ type }) => {
  const { panelStore } = useStores();

  const targetList = useMemo(() => {
    if (type === 'registered')
      return panelStore.registeredTeeList.map(v => JSON.stringify(v));
    else if (type === 'unregistered')
      return panelStore.unregisteredTeeList.map(v => JSON.stringify(v));
    else return [];
  }, [type, panelStore.registeredTeeList, panelStore.unregisteredTeeList]);

  const isAllChecked = useMemo(() => {
    console.log(panelStore.checkedTeeList);
    if (panelStore.checkedTeeList.size === 0 || targetList?.length === 0)
      return false;
    return (
      [...new Set([...panelStore.checkedTeeList, ...targetList])].length ===
      panelStore.checkedTeeList.size
    );
  }, [targetList, panelStore.checkedTeeList]);

  const handleClick = () => {
    isAllChecked
      ? panelStore.removeChecked(targetList)
      : panelStore.addChecked(targetList);
  };

  return (
    <ChipButton
      color='dark'
      padding='4px 12px'
      radius={30}
      onClick={handleClick}
    >
      {isAllChecked ? '전체해제' : '전체선택'}
    </ChipButton>
  );
});

export default CheckController;
