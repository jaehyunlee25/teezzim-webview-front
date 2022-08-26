import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';

const TeeCheckInput = observer(props => {
  const { panelStore, toastStore } = useStores();
  const isChecked = useMemo(
    () =>
      panelStore.checkedTeeList.has(
        JSON.stringify(panelStore.teeListMap?.[props.id]),
      ),
    [panelStore.checkedTeeList, panelStore.teeListMap, props],
  );
  const handleChecked = e => {
    if(props.registered && props.registered != true) {
      const params = { command: 'showToast', data: '먼저 로그인 정보를 입력하세요'};
      if (window.BRIDGE && window.BRIDGE.globalMethod) {
        window.BRIDGE.globalMethod(JSON.stringify(params));
      } else if (window.webkit && window.webkit.messageHandlers ) {
        window.webkit.messageHandlers.globalMethod.postMessage(JSON.stringify(params));
      }
      return;
    }
    const id = e.target.id;
    const value = JSON.stringify(panelStore.teeListMap?.[id]);

    if (!value) return;
    if(!isChecked){
      console.log(props)
      if (props.state === 1 || props.state === 2) {
        props.handleWarnPopup(props.state);
        return;
      }
      if (panelStore.checkedTeeList.size >= 20) {
        toastStore.setMessage(
          <>
            20개 이하의 골프장에서만
            <br /> 예약을 할 수 있습니다.
          </>,
        );
        toastStore.setHidden(false);
        return;
      }
    }
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
