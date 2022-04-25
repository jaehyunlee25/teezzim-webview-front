import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';

const UnregisteredMsg = observer(({ id }) => {
  const { panelStore } = useStores();
  return !panelStore.registeredKeys.includes(id) ? (
    <div className='desc-text'>
      미등록 골프장입니다. 골프장 회원으로 가입해세요. 골프장 회원이라면
      계정등록 후 이용하실 수 있습니다.
    </div>
  ) : (
    <></>
  );
});

export default UnregisteredMsg;
