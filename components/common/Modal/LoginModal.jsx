import Image from 'next/image';
import IMG_Golf_01 from '@/assets/images/IMG_Golf_01.png'; // 임시
import { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import useStores from '@/stores/useStores';
import PopUp from '../PopUp';

// const VIVALDI_LIST = [
//   {clubId: "5d8163d1-cd85-11ec-a93e-0242ac11000a", club: "delphino", name: "델피노"},
//   {clubId: "5a2e3107-cd84-11ec-a93e-0242ac11000a", club: "vivaldi_east", name: "비발디파크 EAST"},
//   {clubId: "ef2fd07b-cd84-11ec-a93e-0242ac11000a", club: "vivaldi_west", name: "비발디파크 WEST"},
//   {clubId: "dd3200eb-cd85-11ec-a93e-0242ac11000a", club: "vivaldi_mountain", name: "비발디파크 마운틴"},
// ];

// const KMH_LIST = [
//   {clubId: "b20397aa-7dea-11ec-b15c-0242ac110005", club: "tgv_KMH", name: "KMH떼제베"},
//   {clubId: "3facbc96-7cfc-11ec-b15c-0242ac110005", club: "shilla_KMH", name: "KMH신라cc"},
//   {clubId: "c5783163-7dec-11ec-b15c-0242ac110005", club: "paganica_KMH", name: "KMH파가니카CC"},
//   {clubId: "ae0b0349-7dce-11ec-b15c-0242ac110005", club: "paju_KMH", name: "KMH파주CC"},
// ];

const LoginModalComponent = observer(({ cb, errCb, handleClose }) => {
  // golfInfo = {clubId, name, loc, img}
  const { modalStore, panelStore, authStore } = useStores();
  const [inputs, setInputs] = useState({ id: '', pw: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isHidePopup, setIsHidePopup]= useState(false);

  // const isVivaldi = useMemo(() => {
  //   const vivaldiIdList = VIVALDI_LIST.map(club => club.clubId);
  //   if (modalStore.golfInfo) {
  //     if (vivaldiIdList.includes(modalStore.golfInfo.clubId)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }, [modalStore.golfInfo]);

  // const isKMH = useMemo(() => {
  //   const kmhIdList = KMH_LIST.map(club => club.clubId);
  //   if (modalStore.golfInfo) {
  //     if (kmhIdList.includes(modalStore.golfInfo.clubId)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }, [modalStore.golfInfo]);

  // Handler
  const handleChange = e => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setSaveSuccess(false);
  };

  const handleLogin = async e => {
    e.preventDefault();
    verifyLoginInfo();
  };

  const handleHomepageLink = (id) => {
    if (window) {
      const url = panelStore.teeListMap?.[id]?.homepage;
      const params = { url };
      /** WEB->APP */
      if (window.BRIDGE && window.BRIDGE.callHomepageLogin) {
        window.BRIDGE.callHomepageLogin(JSON.stringify(params));
      } else if (window.webkit && window.webkit.messageHandlers ) {
        const payload = JSON.stringify({
          command: 'callHomepageLogin',
          data: JSON.stringify(params),
        });
        window.webkit.messageHandlers.globalMethod.postMessage(payload);
      } else {
        alert(url)
      }
    }
  }

  const verifyLoginInfo = () => {
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
    } else if (window.webkit && window.webkit.messageHandlers) {
      const payload = JSON.stringify({
        command: 'saveLoginInfo',
        data: JSON.stringify(data)
      });
      window.webkit.messageHandlers.globalMethod.postMessage(payload);
    } else {
      console.log('이 기능은 앱에서만 동작합니다.');
      return;
    }
  };

  const requestSaveLoginData = () => {
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

    window.localStorage.setItem('account',JSON.stringify(inputs));

    if (window.BRIDGE && window.BRIDGE.requestSaveLoginData) {
      window.BRIDGE.requestSaveLoginData(JSON.stringify(data));
      handleClose();
      authStore.communicate(false);
    } else if (window.webkit && window.webkit.messageHandlers) {
      const payload = JSON.stringify({
        command: 'requestSaveLoginData',
        data: JSON.stringify(data)
      });
      window.webkit.messageHandlers.globalMethod.postMessage(payload);
      handleClose();
      authStore.communicate(false);
    } else {
      console.log('이 기능은 앱에서만 동작합니다.');
      return;
    }
    // if (isVivaldi || isKMH) {
    //   if (isVivaldi) {
    //     if (window.BRIDGE && window.BRIDGE.requestSaveLoginData) {
    //       VIVALDI_LIST.forEach(club => window.BRIDGE.requestSaveLoginData(JSON.stringify({...club, ...inputs})));
    //       handleClose();
    //       authStore.communicate(false);
    //     } else if (window.webkit && window.webkit.messageHandlers) {
    //       VIVALDI_LIST.forEach(club => {
    //         const payload = JSON.stringify({
    //           command: 'requestSaveLoginData',
    //           data: JSON.stringify({...club, ...inputs})
    //         });
    //         window.webkit.messageHandlers.globalMethod.postMessage(payload);
    //       });
    //       handleClose();
    //       authStore.communicate(false);
    //     } else {
    //       console.log('이 기능은 앱에서만 동작합니다.');
    //       return;
    //     }
    //   }
    //   if (isKMH) {
    //     if (window.BRIDGE && window.BRIDGE.requestSaveLoginData) {
    //       KMH_LIST.forEach(club => window.BRIDGE.requestSaveLoginData(JSON.stringify({...club, ...inputs})));
    //       handleClose();
    //       authStore.communicate(false);
    //     } else if (window.webkit && window.webkit.messageHandlers) {
    //       KMH_LIST.forEach(club => {
    //         const payload = JSON.stringify({
    //           command: 'requestSaveLoginData',
    //           data: JSON.stringify({...club, ...inputs})
    //         });
    //         window.webkit.messageHandlers.globalMethod.postMessage(payload);
    //       });
    //       handleClose();
    //       authStore.communicate(false);
    //     } else {
    //       console.log('이 기능은 앱에서만 동작합니다.');
    //       return;
    //     }
    //   }
    // } else {
    //   const data = {
    //     clubId: modalStore.golfInfo.clubId,
    //     club: modalStore.golfInfo.eng,
    //     name: modalStore.golfInfo.name,
    //     ...inputs,
    //   };

    //   if (window.BRIDGE && window.BRIDGE.requestSaveLoginData) {
    //     window.BRIDGE.requestSaveLoginData(JSON.stringify(data));
    //     handleClose();
    //     authStore.communicate(false);
    //   } else if (window.webkit && window.webkit.messageHandlers) {
    //     const payload = JSON.stringify({
    //       command: 'requestSaveLoginData',
    //       data: JSON.stringify(data)
    //     });
    //     window.webkit.messageHandlers.globalMethod.postMessage(payload);
    //     handleClose();
    //     authStore.communicate(false);
    //   } else {
    //     console.log('이 기능은 앱에서만 동작합니다.');
    //     return;
    //   }
    // }
  };


  useEffect(() => {
    window.resultLogin = function (result) {
      if (result) {
        setSaveSuccess(true);
        authStore.communicate(false);
        if (cb) cb();
      }
    };
  }, []);

  // reset when modal unmounted(hidden change)
  useEffect(() => {
    const savedAccount = window.localStorage.getItem('account');
    if (savedAccount) {
      setInputs(JSON.parse(savedAccount));
    }
    setIsHidePopup(false);
    if (modalStore.hidden) {
      setInputs({ id: '', pw: '' });
      setShowPwd(false);
      setSaveSuccess(false);
    }
    modalStore.setErrCode(null);
  }, [modalStore.hidden, modalStore]);

  return (
    <>
      <PopUp
        smallClose={true}
        hidden={isHidePopup}
        buttonText='확인'
        onButtonClick={e => {
          setIsHidePopup(true);
        }}
      >
        <div className='login-notice-icon mt-30 mb-5' />
        <div className='login-popup mb-20'>
          <strong>
          &#39;사용자의 골프장 계정 아이디와 패스워드는<br />
            휴대폰에서만 저장될 뿐 	&#40;주&#41;티티픽은 이를 외부에<br />
            반출하거나 저장하지 않습니다.&#39;
          </strong>
        </div>
      </PopUp>
      <div className='ctn'>
        <div className='login_wrap'>
          <div className='login_img'>
            <Image
              src={modalStore.golfInfo?.img ?? IMG_Golf_01}
              alt=''
              width='100%'
              height='100%'
            />
            <p className='heading-title_03'>{modalStore.golfInfo?.name}</p>
            <span className='caption'>{modalStore.golfInfo?.loc}</span>
          </div>

          <form>
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
                  <div className='eye-container' onClick={() => setShowPwd(!showPwd)}>
                    <div
                      className={`eye ${showPwd ? 'bi-eye' : 'bi-eye-slash'}`}
                      id='togglePassword'
                    ></div>
                    <span className='eye-text'>{showPwd ? '감추기' : '보이기'}</span>
                  </div>
                </div>
              </div>
              {/* {
                saveSuccess ?
                  <div className='verify_wrap'>
                    <span className='text-primary pt-8 pb-8'>&quot;계정정보를 다시 한번 확인 하시고 등록해주세요&quot;</span>
                  </div>
                  :
                  <div className='verify_wrap'>
                    <span>아이디/패스워드를 검증해주세요</span>
                    <div className='verify_btn' onClick={handleLogin}>
                      <span>검증하기</span>
                    </div>
                  </div>
              } */}
                  <div className='verify_wrap'>
                    <span>아이디/패스워드를 검증해주세요</span>
                    <div className='verify_btn' onClick={handleLogin}>
                      <span>검증하기</span>
                    </div>
                  </div>
              {modalStore.errCode && (
                <span className='text-warning' style={{ margin: '8px 0px' }}>
                  아이디 또는 비밀번호가 일치하지 않습니다.
                </span>
              )}
            </div>
            <div className='btn-apply'>
                <button
                  type='button'
                  className={saveSuccess ? 'bg-action text-white' : 'disabled'}
                  onClick={requestSaveLoginData}
                  disabled={!saveSuccess}
                >
                  등록하기
                </button>
            </div>
            <div className='sign-in-wrap'>
              <span onClick={()=>handleHomepageLink(modalStore.golfInfo.clubId)}>회원가입하기</span>
              <div className='sign-in-icon'></div>
            </div>
            <div className='bubble-wrap'>
              <div className='bubble'>
                <div className='tail'></div>
                <span>비회원인 경우 먼저 가입후에 등록하실 수 있습니다.</span>
              </div>
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
