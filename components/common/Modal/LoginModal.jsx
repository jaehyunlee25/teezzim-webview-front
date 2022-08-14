import Image from 'next/image';
import IMG_Golf_01 from '@/assets/images/IMG_Golf_01.png'; // 임시
import ModalContainer from './ModalContainer';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import useStores from '@/stores/useStores';
import axios from 'axios';

const LoginModalComponent = observer(({ cb, errCb, handleClose }) => {
  // golfInfo = {clubId, name, loc, img}
  const { modalStore, loadStore, authStore } = useStores();
  const [inputs, setInputs] = useState({ id: '', pw: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handler
  const handleChange = e => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleLogin = async e => {
    e.preventDefault();
    saveLoginInfo();
  };

  const saveLoginInfo = () => {
    // const sampleData = {
    //   clubId: '골프장식별자',
    //   club: '골프장영문식별자',
    //   name: '골프장 한글 이름',
    //   id: '아이디',
    //   pw: '패스워드',
    // };
    const data = {
      clubId: modalStore.golfInfo.clubId,
      club: modalStore.golfInfo.eng,
      name: modalStore.golfInfo.name,
      ...inputs,
    };
    if (window.BRIDGE && window.BRIDGE.saveLoginInfo) {
        window.BRIDGE.saveLoginInfo(JSON.stringify(data));
    } else if (window.webkit && window.webkit.messageHandlers ) {
        window.webkit.messageHandlers.saveLoginInfo.postMessage(JSON.stringify(data));
    } else {
      alert('이 기능은 앱에서만 동작합니다.');
      return;
    }
  };

  // webview test only
  useEffect(() => {
    if (window) {
      if (!window.BRIDGE || !window.BRIDGE.saveLoginInfo) {
        window.BRIDGE = {};
        window.BRIDGE.saveLoginInfo = data => console.log(data);
      }
    }
    window.resultLogin = function (result) {
      if(result == 'OK') {
        setSaveSuccess(true);
        authStore.communicate(false);
        if (cb) cb();
      }
    };
  }, []);

  // reset when modal unmounted(hidden change)
  useEffect(() => {
    if (modalStore.hidden) {
      setInputs({ id: '', pw: '' });
      setShowPwd(false);
      setSaveSuccess(false);
    }
    modalStore.setErrCode(null);
  }, [modalStore.hidden, modalStore]);

  return (
    <>
      <div className='ctn'>
        <div className='login_wrap'>
          <div className='login_img'>
            <Image
              src={modalStore.golfInfo?.img ?? IMG_Golf_01}
              alt=''
              width='100%'
              height='100%'
            />
            {saveSuccess ? (
              <>
                <p className='heading-title_02' style={{ paddingTop: 28 }}>
                  {modalStore.golfInfo?.name}
                </p>
                <span className='medium-Emphasis01'>
                  계정 등록을 완료했습니다.
                </span>
              </>
            ) : (
              <>
                <p className='heading-title_03'>{modalStore.golfInfo?.name}</p>
                <span className='caption'>{modalStore.golfInfo?.loc}</span>
              </>
            )}
          </div>

          <form>
            {saveSuccess ? null : (
              <div className='login_box'>
                <div className='input_item'>
                  <div className='input_inner'>
                    <input
                      type='text'
                      id='id'
                      name='id'
                      accessKey='L'
                      autoCapitalize='none'
                      placeholder='아이디'
                      className='input_text'
                      value={inputs.id}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className='input_item'>
                  <div className='input_inner'>
                    <input
                      type={showPwd ? 'text' : 'password'}
                      id='password'
                      name='pw'
                      placeholder='비밀번호'
                      className='input_password'
                      value={inputs.pw}
                      onChange={handleChange}
                    />
                    <i
                      className={`eye ${showPwd ? 'bi-eye' : 'bi-eye-slash'}`}
                      id='togglePassword'
                      onClick={() => setShowPwd(!showPwd)}
                    ></i>
                  </div>
                </div>
                {modalStore.errCode && (
                  <span className='text-warning' style={{ margin: '8px 0px' }}>
                    아이디 또는 비밀번호가 일치하지 않습니다.
                  </span>
                )}
              </div>
            )}

            <div className='btn-apply'>
              {saveSuccess ? (
                <button
                  type='button'
                  className='bg-action text-white'
                  onClick={handleClose}
                >
                  확인
                </button>
              ) : (
                <button
                  type='button'
                  className={
                    inputs.id && inputs.pw ? 'bg-action text-white' : 'disabled'
                  }
                  disabled={!inputs.id || !inputs.pw}
                  onClick={handleLogin}
                >
                  로그인
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        .input_text,
        .input_password {
          width: 100%;
        }
        .disabled {
          opacity: 1;
          background-color: var(--neutrals-grey-5);
          color: var(--neutrals-gray-6);
        }
        button {
          margin-top: 8px;
        }
      `}</style>
    </>
  );
});

const LoginModal = props => <LoginModalComponent {...props} />;
export default LoginModal;
