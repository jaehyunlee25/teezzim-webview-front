import { makeObservable, action, observable, computed } from 'mobx';

/** 계정 정보 패널의 사용자 Action 관련 상태 스토어 */
class PanelStore {
  _teeList = []; // API를 통해 가져온 Tee List
  _registeredTeeList = [
    {
      id: '4c6747cf-774f-11ec-b15c-0242ac110005',
      name: '인천그랜드CC',
      address: '인천광역시 서구 원석로 195 (원창동)',
      phone: '032-584-3111~4',
      area: '수도권',
      email: '',
      homepage: 'https://www.incheongrand.cc/pagesite/club/intro.asp',
      corp_reg_number: '126-86-04321',
      description:
        '서울에서 30분, 서인천IC에서 3Km에 위치해 접근성이 좋고, 국내 최초로 공공하수처리장 방류수를 중수처리하여 골프장 조경용수로 대규모\n재활용하는 자연친화적인 환경시스템을 운영하고 있으며, 18홀 전홀 라이트 시설을 설치하여 일몰 후에도 야간 라운드를 즐길 수 있습니다.\n\n섬세하면서도 정교한 플레이가 요구되는 인천그랜드 컨트리클럽은 전장 길이가 6,310야드(Regular Tee)로 플랫하면서도 곳곳에 배치된 폰드와\n벙커로 난이도를 조정하고 도심에 위치해 있어도 자연의 낭만을 즐길 수 있으며 아름다운 조경과 코스의 조화로 다양한 모습을 연출하여 색다른 골프의\n묘미를 맛볼 수 있습니다.\n\n인천그랜드 컨트리클럽 전 임직원 일동은 환경 친화적이고 품격있는 대중 골프장을 만들도록 최선을 다해 끊임없는 노력을 기울이겠습니다.\n\n인천그랜드 컨트리클럽 임직원일동',
      created_at: '2022-01-17T04:38:20.000Z',
      updated_at: '2022-01-17T04:38:20.000Z',
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
