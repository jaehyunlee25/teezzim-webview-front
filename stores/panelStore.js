import { makeAutoObservable, action, observable, computed } from 'mobx';

/** 계정 정보 패널의 사용자 Action 관련 상태 스토어 */
class PanelStore {
  teeList = []; // API를 통해 가져온 Tee List
  registeredTeeList = []; // API를 통해 등록한 Tee List
  checkedTeeList = []; // 체크박스를 클릭한 Tee List

  constructor() {
    makeAutoObservable(
      this,
      {
        teeList: observable,
        registeredTeeList: observable,
        checkedTeeList: observable,
        unregisteredTeeList: computed,
        totalUnregisteredTee: computed,
        totalRegisteredTee: computed,
        totalCheckedTee: computed,
        setTeeList: action,
        setRegisteredTeeList: action,
        initTee: action,
      },
      { autoBind: true },
    );
  }

  get unregisteredTeeList() {
    return this.teeList.filter(
      ({ id }) => !this.registeredTeeList.includes(id),
    );
  }

  get totalUnregisteredTee() {
    return this.unregisteredTeeList.length;
  }

  get totalRegisteredTee() {
    return this.registeredTeeList.length;
  }

  get totalCheckedTee() {
    return this.checkedTeeList.length;
  }

  setTeeList(teeList) {
    this.teeList = teeList;
  }

  setRegisteredTeeList(registeredTeeList) {
    this.registeredTeeList = registeredTeeList;
  }

  initTee() {
    this.teeList = [];
    this.registeredTeeList = [];
  }
}

const panelStore = new PanelStore();
export default panelStore;
