import { makeObservable, observable, computed, action } from 'mobx';

/** 회원 로그인 상태 및 사용자 관련 상태 스토어 **/
class AuthStore {
  authToken = 'not login'; // 회원 인증 login token
  // isAuth = false; // computed

  constructor() {
    makeObservable(this, {
      authToken: observable,
      isAuth: computed,
      signOut: action,
      signIn: action,
      autoLoginProcess: action,
    });
  }

  get isAuth() {
    return this.authToken.length > 16;
  }

  signOut() {
    this.authToken = '';
  }

  signIn(authToken) {
    this.authToken = authToken;
    window.localStorage.setItem('authToken', authToken);
  }

  autoLoginProcess() {
    if (this.isAuth) return; // 이미 로그인 되어 있으면 pass
    const savedAuthToken = window.localStorage.getItem('authToken');
    // console.log(savedAuthToken);
    if (savedAuthToken) {
      console.log('auto login'); // TODO 유효한 로그인인지 API 확인도 필요함
      this.authToken = savedAuthToken;
    }
  }
}

const authStore = new AuthStore();
export default authStore;
