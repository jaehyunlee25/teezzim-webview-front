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

  const sendCheckedData = (command, value) => {
    if(command === 'addChecked') {
      panelStore.addChecked(value);
    } else {
      panelStore.removeChecked(value);
    }
    const teeObj = JSON.parse(value);
    const checkedData = {
      command: command,
      data: { club: teeObj.eng, club_id: teeObj.id },
    }
    if (window.BRIDGE && window.BRIDGE.sendResponse) {
      window.BRIDGE.sendResponse(JSON.stringify(checkedData));
    } else if (window.webkit && window.webkit.messageHandlers ) {
      window.webkit.messageHandlers.sendResponse.postMessage(JSON.stringify(checkedData));
    }
  }
  
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
    isChecked ? sendCheckedData('removeChecked', value) : sendCheckedData('addChecked', value);

    // checkList 저장 코드
    let saveData = [];
    for (const saveItem of panelStore.checkedTeeList){
      const saveCtl = JSON.parse(saveItem);
      if (saveCtl.state !== 1 || saveCtl.state !== 2){
        saveData.push({ club: saveCtl.eng, club_id: saveCtl.id });
      }
    }
    window.localStorage.setItem('checkList', JSON.stringify(saveData));

  };
  return (
    <>
      {/*btn_check_box  */}
      <div className='btn_check_box' onClick={handleChecked}>
        <span className='checkbox'>
          <input
            id={props.id}
            type='checkbox'
            name={props.name}
            checked={isChecked}
            readOnly
            // onChange={handleChecked}
          />
          <label htmlFor={props.id}></label>
        </span>
      </div>
      {/*//btn_check_box  */}
      <style jsx>{`
        .btn_check_box {
          position: absolute;
          right: 8px;
          margin: 0px;
          padding: 8px; 
          /* background-color: red; */
        }
        label {
          padding: 8px;
        }
      `}</style>
    </>
  );
});

export default TeeCheckInput;
