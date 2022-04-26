const { makeObservable, observable, computed, action } = require('mobx');

class AuthStore {
  _authList = [];
  _communicated = false;

  constructor() {
    makeObservable(this, {
      _authList: observable,
      _communicated: observable,
      authList: computed,
      communicated: computed,
      saveAuthList: action,
      communicate: action,
    });
  }

  get authList() {
    return this._authList;
  }

  get communicated() {
    return this._authSaved?.length > 0 || this._communicated;
  }

  saveAuthList(authList) {
    this._authList = authList;
  }

  communicate() {
    this._communicated = true;
  }
}

const authStore = new AuthStore();
export default authStore;
