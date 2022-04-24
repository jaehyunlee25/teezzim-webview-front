import { makeObservable, action, observable, computed } from 'mobx';

/** 계정 정보 패널의 사용자 Action 관련 상태 스토어 */
class PanelStore {
  _teeList = []; // API를 통해 가져온 Tee List
  _registeredTeeList = [
    {
      id: '6cbc1160-79af-11ec-b15c-0242ac110005',
      name: '아일랜드CC',
      address: '15647 경기도 안산시 단원구 대선로 466 (대부남동 1111)',
      phone: '032-884-1004',
      area: '수도권',
      email: '',
      homepage: 'https://www.islandresort.co.kr/index.asp',
      corp_reg_number: '134-86-38098',
      description:
        'https://www.islandresort.co.kr/images/company/company01_1.jpg',
      created_at: '2022-01-20T05:11:29.000Z',
      updated_at: '2022-01-20T05:11:29.000Z',
    },
  ]; // 골프장 계정을 등록한 Tee List => 네이티브랑 통신헀다고 가정하고 임시로 데이터 한 개 넣어놓음
  _checkedTeeList = new Set(); // 체크박스를 클릭한 Tee List
  _filter = null;

  constructor() {
    makeObservable(
      this,
      {
        _teeList: observable,
        _registeredTeeList: observable,
        _checkedTeeList: observable,
        _filter: observable,

        teeList: computed,
        registeredTeeList: computed,
        registeredKeys: computed,
        unregisteredTeeList: computed,
        checkedTeeList: computed,
        checkedKeys: computed,
        groupedCheckList: computed,
        filter: computed,
        filterList: computed,
        teeListMap: computed,

        setTeeList: action,
        setRegisteredTeeList: action,
        setFilter: action,
        addChecked: action,
        removeChecked: action,
        initTee: action,
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
    return !this._filter
      ? this._registeredTeeList
      : this._registeredTeeList.filter(({ area }) => area === this._filter);
  }

  /**
   * 등록된 TeeList의 id 배열
   */
  get registeredKeys() {
    return this.registeredTeeList.map(({ id }) => id);
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

  setTeeList(teeList) {
    this._teeList = teeList;
  }

  setRegisteredTeeList(registeredTeeList) {
    this._registeredTeeList = registeredTeeList;
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

  initTee() {
    this._teeList = [];
    this._registeredTeeList = [];
    this._checkedTeeList = [];
  }
}

const panelStore = new PanelStore();
export default panelStore;
