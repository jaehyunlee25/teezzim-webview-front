import { makeObservable, observable, action } from 'mobx';
import { createRef } from 'react';

class ModalStore {
  registered;
  errCode;
  hidden = true;
  golfInfo; // {id, name, area, img}
  // authInfo => authStore.authList

  constructor() {
    makeObservable(this, {
      registered: observable,
      errCode: observable,
      hidden: observable,
      golfInfo: observable,
      setRegistered: action,
      setGolfInfo: action,
      setModalHidden: action,
      setErrCode: action,
    });
  }

  setRegistered(registered) {
    this.registered = registered;
  }

  setGolfInfo(golfInfo) {
    this.golfInfo = golfInfo;
  }

  setModalHidden(hidden) {
    this.hidden = hidden;
  }

  setErrCode(errCode) {
    this.errCode = errCode;
  }
}

const modalStore = new ModalStore();
export default modalStore;
