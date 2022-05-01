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
    const res = await axios.post(
      `/teezzim/teeapi/v1/club/${id}/reservation/post`,
      {
        ...account,
        ...postInfo,
      },
      { cancelToken: source.token },
    );
    if (res.status === 200) {
      console.log(data);
      const {
        data = null,
        resultCode = null,
        message = null,
      } = res?.data ?? {};
      if (resultCode === 1) {
        if (cb) cb();
      } else if (resultCode === -1) {
        console.warn(
          `[errorCode : ${resultCode}] ${message}, 이미 등록된 예약이거나 일시적 오류`,
        );
      }
    } else {
      console.warn(`[errorCode] : 통신 장애 또는 내부 에러입니다.`);
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
