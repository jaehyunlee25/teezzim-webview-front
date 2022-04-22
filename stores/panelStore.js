import { makeObservable, action, observable, computed } from 'mobx';

/** 계정 정보 패널의 사용자 Action 관련 상태 스토어 */
class PanelStore {
  _teeList = []; // API를 통해 가져온 Tee List
  _registeredTeeList = [
    {
      address: '충북 충주시 신니면 대화리 화치 3길 35호',
      area: '충청도',
      corp_reg_number: '105-85-42826',
      created_at: '2022-04-19T17:49:20.000Z',
      description:
        '로얄포레 컨트리클럽에 방문하신 것을 환영합니다.\n\n로얄포레 컨트리클럽의 모든 임직원들은\n고객 여러분께서 내 집같은 분위기 속에 편안히 여가를 즐기실 수 있도록 최상의 친절과 서비스 정신으로 특별히 모시겠습니다.\n아울러 세심한 코스관리와 지속적인 시설투자 그리고 다양한 컨텐츠개발로 라운딩의 즐거움이 배가될 수 있도록 지속적인 혁신을 이어가겠습니다.\n\n최고의 품격을 갖춘 사교의 장에서 최상의 만족을 느끼실 수 있도록 혼신의 노력을 다하겠습니다.\n\n감사합니다.',
      email: '',
      homepage: 'https://www.ilcc.co.kr/club/club_ro.asp',
      id: '08a3198e-c009-11ec-a93e-0242ac11000a',
      name: '로얄포레CC',
      phone: '043-857-5000',
      updated_at: '2022-04-19T17:49:20.000Z',
    },
  ]; // 골프장 계정을 등록한 Tee List => 네이티브랑 통신헀다고 가정하고 임시로 데이터 한 개 넣어놓음
  _checkedTeeList = new Set(); // 체크박스를 클릭한 Tee List
  _teeListMap = {};

  constructor() {
    makeObservable(
      this,
      {
        _teeList: observable,
        _registeredTeeList: observable,
        _checkedTeeList: observable,
        teeList: computed,
        registeredTeeList: computed,
        registeredKeys: computed,
        unregisteredTeeList: computed,
        unregisteredKeys: computed,
        checkedTeeList: computed,
        setTeeList: action,
        setRegisteredTeeList: action,
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
    return this._registeredTeeList;
  }

  /**
   * 등록된 TeeList의 id 배열
   */
  get registeredKeys() {
    return this._registeredTeeList.map(({ id }) => id);
  }

  /**
   * 미등록된 TeeList의 객체 배열
   */
  get unregisteredTeeList() {
    return this._teeList.filter(({ id }) => !this.registeredKeys.includes(id));
  }

  /**
   * 미등록 TeeList의 id 배열
   */
  get unregisteredKeys() {
    return this.unregisteredTeeList.map(({ id }) => id);
  }

  /**
   * 사용자가 체크한 TeeList의 id 배열
   */
  get checkedTeeList() {
    return this._checkedTeeList;
  }

  setTeeList(teeList) {
    this._teeList = teeList;
    this._teeListMap = teeList.reduce(
      (acc, tee) => ({ ...acc, [tee.id]: tee }),
      {},
    );
  }

  setRegisteredTeeList(registeredTeeList) {
    this._registeredTeeList = registeredTeeList;
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
