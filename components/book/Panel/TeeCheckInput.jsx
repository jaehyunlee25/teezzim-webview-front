import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';

const TeeCheckInput = observer(({ id, name }) => {
  const { panelStore } = useStores();
  const isChecked = useMemo(
    () => panelStore.checkedTeeList.has(id),
    [panelStore.checkedTeeList, id],
  );
  const handleChecked = e => {
    const id = e.target.id;
    isChecked ? panelStore.removeChecked(id) : panelStore.addChecked(id);
  };
  return (
    <>
      {/*btn_check_box  */}
      <div className='btn_check_box'>
        <span className='checkbox'>
          <input
            id={id}
            type='checkbox'
            name={name}
            checked={isChecked}
            onChange={handleChecked}
          />
          <label htmlFor={id}></label>
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
