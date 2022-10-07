const { makeObservable, observable, computed, action } = require('mobx');

class AuthStore {
  _authList = [];
  _communicated = false;
  _deviceId = "";
  _isResetSearchValue = false;

  constructor() {
    makeObservable(this, {
      _authList: observable,
      _communicated: observable,
      _deviceId: observable,
      _isResetSearchValue: observable,
      authList: computed,
      communicated: computed,
      deviceId: computed,
      isResetSearchValue: computed,
      saveAuthList: action,
      communicate: action,
      setDeviceId: action,
      setIsResetSearchValue: action,
    });
  }

  get authList() {
    return this._authList;
  }

  get communicated() {
    return this._communicated;
  }

  get deviceId() {
    return this._deviceId;
  }

  get isResetSearchValue() {
    return this._isResetSearchValue;
  }

  saveAuthList(authList) {
    this._authList = authList;
  }

  communicate(condition) {
    this._communicated = condition ?? true;
  }

  setDeviceId(did) {
    this._deviceId = did;
  }

  setIsResetSearchValue(boolean) {
    this._isResetSearchValue = boolean;
  }
}

const authStore = new AuthStore();
export default authStore;
