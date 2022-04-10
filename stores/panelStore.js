import { makeObservable, action, observable, computed } from 'mobx';

/** 계정 정보 패널의 사용자 Action 관련 상태 스토어 */
class PanelStore {
  teeList = []; // API를 통해 가져온 Tee List
  registeredTeeList = []; // API를 통해 등록한 Tee List
  checkedTeeList = []; // 체크박스를 클릭한 Tee List

  constructor() {
    makeObservable(
      this,
      {
        teeList: observable,
        registeredTeeList: observable,
        checkedTeeList: observable,
        unregisteredTeeList: computed,
        totalUnregisteredTee: computed,
        totalRegisteredTee: computed,
        totalCheckedTee: computed,
        isAllChecked: computed,
        setTeeList: action,
        setRegisteredTeeList: action,
        pushCheckedTeeList: action,
        popCheckedTeeList: action,
        initTee: action,
      },
      { autoBind: true },
    );
  }

  get unregisteredTeeList() {
    return this.teeList.filter(
      ({ id }) => !this.registeredTeeList.map(({ id }) => id).includes(id),
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

  get isAllChecked() {
    return {
      registered:
        [...new Set([...this.registeredTeeList, ...this.checkedTeeList])]
          .length ===
        this.teeList.length - this.totalRegisteredTee,
      unregistered:
        [...new Set([...this.unregisteredTeeList, ...this.checkedTeeList])]
          .length ===
        this.teeList.length - this.totalUnregisteredTee,
    };
  }

  get checkedTeeList() {
    return this.checkedTeeList;
  }

  setTeeList(teeList) {
    this.teeList = teeList;
  }

  setRegisteredTeeList(registeredTeeList) {
    this.registeredTeeList = registeredTeeList;
  }

  pushCheckedTeeList = tid => {
    console.log(this.checkedTeeList);
    if (Array.isArray(tid))
      this.checkedTeeList = [...new Set([...this.checkedTeeList, ...tid])];
    else this.checkedTeeList = [...new Set([...this.checkedTeeList, tid])];
    console.log(this.checkedTeeList);
  };

  popCheckedTeeList = tid => {
    if (Array.isArray(tid))
      this.checkedTeeList = this.checkedTeeList.filter(
        ({ id }) => !tid.includes(id),
      );
    else
      this.checkedTeeList = this.checkedTeeList.filter(({ id }) => tid !== id);
    console.log(this.checkedTeeList);
  };

  initTee() {
    this.teeList = [];
    this.registeredTeeList = [];
    this.checkedTeeList = [];
  }
}

const panelStore = new PanelStore();
export default panelStore;
