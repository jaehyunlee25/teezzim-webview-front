import { makeObservable, observable, action } from 'mobx';
import { createRef } from 'react';

class ModalStore {
  registered;
  errCode;
  visiblePath;
  hidden = true;
  golfInfo; // {id, name, area, img}
  // authInfo => authStore.authList

  constructor() {
    makeObservable(this, {
      registered: observable,
      errCode: observable,
      hidden: observable,
      golfInfo: observable,
      visiblePath: observable,
      setRegistered: action,
      setGolfInfo: action,
      setVisiblePath: action,
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

  setVisiblePath(visiblePath){
    this.visiblePath = visiblePath;
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
