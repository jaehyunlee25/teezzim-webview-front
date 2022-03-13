import {makeObservable, observable, action} from "mobx";

/** 사이트 전체에 사용되는 전역 스토어 */
class GlobalStore {
  isTest = false;

  constructor() {
    makeObservable(this, {
      isTest: observable,
      toggleIsTestValue: action,
    });
    this.isTest = true;
  }

  toggleIsTestValue() {
    this.isTest = !this.isTest;
  }
}

const globalStore = new GlobalStore();
export default globalStore;
