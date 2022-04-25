import axios from 'axios';
import useStores from '@/stores/useStores';
import { observer } from 'mobx-react-lite';
import HomepageLink from '@/components/layouts/reserve/HomepageLink';

const ButtonGroup = observer(({ id, postInfo, source, cb, onButtonClick }) => {
  const { panelStore } = useStores();
  // account 넘어 왔다고 가정
  const account = {
    id: 'newrison',
    password: 'ilovegolf778',
  };

  const handleCreateReserve = async () => {
    if (onButtonClick) onButtonClick();
    const {
      status,
      data: { data, resultCode, message },
    } = await axios.post(
      `/teezzim/teeapi/v1/club/${id}/reservation/post`,
      {
        ...account,
        ...postInfo,
      },
      { cancelToken: source.token },
    );
    if (status === 200) {
      console.log(data);
      if (resultCode === 1) {
        if (cb) cb();
      } else {
        console.warn(`[errorCode : ${resultCode}] ${message}`);
      }
    } else {
      console.warn(`[errorCode : ${status}] ${message}`);
    }
  };
  return (
    <>
      {panelStore.registeredKeys.includes(id) ? (
        <div className='component-wrap'>
          <ul className='btn-group btn-group__fixed'>
            <li>
              <button
                type='button'
                className='btn large rest full'
                onClick={handleCreateReserve}
              >
                간편예약
              </button>
            </li>
            <li>
              <HomepageLink
                id={id}
                type='button'
                className='btn large rest full'
              >
                홈페이지예약
              </HomepageLink>
            </li>
          </ul>
        </div>
      ) : (
        <div className='component-wrap'>
          <ul className='btn-group btn-group__fixed'>
            <HomepageLink id={id} type='button' className='btn large rest full'>
              골프장 회원가입
            </HomepageLink>

            <li>
              <button type='button' className='btn large rest full'>
                골프장 계정등록
              </button>
            </li>
          </ul>
        </div>
      )}
      <style jsx>{`
        .btn-group {
          display: flex;
          bottom: 72px;
        }
      `}</style>
    </>
  );
});

export default ButtonGroup;
