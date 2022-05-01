const { makeObservable, observable, computed, action } = require('mobx');

class ToastStore {
  _hidden = true;
  _message = '';

  constructor() {
    makeObservable(this, {
      _hidden: observable,
      _message: observable,

      hidden: computed,
      message: computed,

      setHidden: action,
      setMessage: action,
    });
  }

  get hidden() {
    return this._hidden;
  }

  get message() {
    return this._message;
  }

  setHidden(hidden) {
    this._hidden = hidden;
  }

  setMessage(message) {
    this._message = message;
  }
}

const toastStore = new ToastStore();
export default toastStore;
