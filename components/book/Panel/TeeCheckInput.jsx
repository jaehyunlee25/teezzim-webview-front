import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';

const TeeCheckInput = observer(props => {
  const { panelStore } = useStores();
  const isChecked = useMemo(
    () =>
      panelStore.checkedTeeList.has(
        JSON.stringify(panelStore.teeListMap?.[props.id]),
      ),
    [panelStore.checkedTeeList, panelStore.teeListMap, props],
  );
  const handleChecked = e => {
    const id = e.target.id;
    const value = JSON.stringify(panelStore.teeListMap?.[id]);

    if (!value) return;
    isChecked ? panelStore.removeChecked(value) : panelStore.addChecked(value);
  };
  return (
    <>
      {/*btn_check_box  */}
      <div className='btn_check_box'>
        <span className='checkbox'>
          <input
            id={props.id}
            type='checkbox'
            name={props.name}
            checked={isChecked}
            onChange={handleChecked}
          />
          <label htmlFor={props.id}></label>
        </span>
      </div>
      {/*//btn_check_box  */}
      <style jsx>{`
        .btn_check_box {
          position: absolute;
          right: 16px;
          margin: 0px;
        }
        label {
          padding: 8px;
        }
      `}</style>
    </>
  );
});

export default TeeCheckInput;
