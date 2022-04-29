import { makeObservable, action, observable, computed } from 'mobx';

/** 계정 정보 패널의 사용자 Action 관련 상태 스토어 */
class PanelStore {
  _teeList = []; // API를 통해 가져온 Tee List
  _registeredKeys = []; // 골프장 계정을 등록한 Tee List
  _checkedTeeList = new Set(); // 체크박스를 클릭한 Tee List
  _filter = null; // 패널 상단 지역 필터
  _panelHidden = false; // 패널 숨김 여부

  constructor() {
    makeObservable(
      this,
      {
        _teeList: observable,
        _registeredKeys: observable,
        _checkedTeeList: observable,
        _filter: observable,
        _panelHidden: observable,

        teeList: computed,
        registeredTeeList: computed,
        unregisteredTeeList: computed,
        checkedTeeList: computed,
        checkedKeys: computed,
        groupedCheckList: computed,
        filter: computed,
        filterList: computed,
        teeListMap: computed,
        panelHidden: computed,

        setTeeList: action,
        setRegisteredKeys: action,
        setFilter: action,
        addChecked: action,
        removeChecked: action,
        setPanelHidden: action,
      },
      { autoBind: true },
    );
  }

  get teeList() {
    return this._teeList;
  }

  /**
   * 등록된 TeeList의 객체 배열
   */
  get registeredTeeList() {
    return this._teeList.filter(({ id, area }) =>
      this._filter
        ? area === this._filter && this.registeredKeys.includes(id)
        : this.registeredKeys.includes(id),
    );
  }

  /**
   * 등록된 TeeList의 id 배열
   */
  get registeredKeys() {
    return this._registeredKeys;
  }

  /**
   * 미등록된 TeeList의 객체 배열
   */
  get unregisteredTeeList() {
    return !this._filter
      ? this._teeList.filter(({ id }) => !this.registeredKeys.includes(id))
      : this._teeList.filter(
          ({ id, area }) =>
            !this.registeredKeys.includes(id) && area === this._filter,
        );
  }

  /**
   * 사용자가 체크한 TeeList의 id 배열
   */
  get checkedTeeList() {
    return this._checkedTeeList;
  }

  get checkedKeys() {
    return [...this._checkedTeeList].map(v => JSON.parse(v).id);
  }

  get groupedCheckList() {
    return [...this._checkedTeeList].reduce(
      (acc, v) => {
        const area = JSON.parse(v)?.area;
        return { ...acc, [area]: acc?.[area] ? acc[area] + 1 : 1 };
      },
      { 전체: this._checkedTeeList.size },
    );
  }

  get filter() {
    return this._filter;
  }

  get filterList() {
    return [...new Set(this._teeList.map(({ area }) => area))];
  }

  get teeListMap() {
    return this._teeList.reduce((acc, tee) => ({ ...acc, [tee.id]: tee }), {});
  }

  get panelHidden() {
    return this._panelHidden;
  }

  setTeeList(teeList) {
    this._teeList = teeList;
  }

  setRegisteredKeys(teeList) {
    this._registeredKeys = teeList;
  }

  setFilter(area) {
    this._filter = area;
  }

  addChecked(data) {
    if (Array.isArray(data))
      this._checkedTeeList = new Set([...this._checkedTeeList, ...data]);
    else this._checkedTeeList = new Set([...this._checkedTeeList, data]);
  }

  removeChecked(data) {
    if (Array.isArray(data)) data.forEach(v => this._checkedTeeList.delete(v));
    else this._checkedTeeList.delete(data);
    this._checkedTeeList = new Set([...this.checkedTeeList]);
  }

  setPanelHidden(hidden) {
    this._panelHidden = hidden;
  }
}

const panelStore = new PanelStore();
export default panelStore;
