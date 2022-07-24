const { makeObservable, observable, computed, action } = require('mobx');

class AuthStore {
  _authList = [];
  _communicated = false;
  _deviceId = "";

  constructor() {
    makeObservable(this, {
      _authList: observable,
      _communicated: observable,
      _deviceId: observable,
      authList: computed,
      communicated: computed,
      saveAuthList: action,
      communicate: action,
      setDeviceId: action,
    });
  }

  get authList() {
    return this._authList;
  }

  get communicated() {
    return this._communicated;
  }

  saveAuthList(authList) {
    this._authList = authList;
  }

  communicate(condition) {
    this._communicated = condition ?? true;
  }

  setDeviceId(did){
    this._deviceId = did;
  }
}

const authStore = new AuthStore();
export default authStore;
