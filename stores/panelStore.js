import { makeObservable, action, observable, computed } from 'mobx';

/** 계정 정보 패널의 사용자 Action 관련 상태 스토어 */
class PanelStore {
  teeList = []; // API를 통해 가져온 Tee List
  checkedTeeList = []; // 체크박스를 클릭한 Tee List
  registeredTeeList = []; // API를 통해 등록한 Tee List

  constructor() {
    makeObservable(this, {
      checkedTees: observable,
      unregisteredTee: computed,
      totalUnregisteredTee: computed,
      totalRegisteredTee: computed,
      totalCheckedTee: computed,
    });
  }

  get unregisteredTee() {
    return this.teeList.filter(({ id }) => this.registeredTeeList.includes(id));
  }

  get totalUnregisteredTee() {
    return this.teeList.length - this.registeredTeeList.length;
  }

  get totalRegisteredTee() {
    return this.registeredTeeList.length;
  }

  get totalCheckedTee() {
    return this.checkedTeeList.length;
  }
}

const panelStore = new PanelStore();
export default panelStore;
