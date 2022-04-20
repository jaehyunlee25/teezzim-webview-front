const { makeObservable, observable, computed, action } = require('mobx');

class LoadStore {
  _loading = false;
  _error = false;

  constructor() {
    makeObservable(this, {
      _loading: observable,
      _error: observable,
      isLoading: computed,
      isError: computed,
      setLoading: action,
      setError: action,
      reset: action,
    });
  }

  get isLoading() {
    return this._loading;
  }

  get isError() {
    return this._error;
  }

  setLoading(status) {
    this._loading = status;
  }

  setError(status) {
    this._error = status;
  }

  reset() {
    this._loading = false;
    this._error = false;
  }
}

const loadStore = new LoadStore();
export default loadStore;
