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
    {
      id: '88475b10-7c43-11ec-b15c-0242ac110005',
      name: '동촌CC',
      address: '27452 충청북도 충주시 노은면 감노로 1327',
      phone: '043-722-0707',
      area: '충청도',
      email: '',
      homepage: 'https://www.dongchongc.co.kr:442/',
      corp_reg_number: '206-86-10769',
      description:
        '고객의 가치를 위하여 혁신하는 골프장\n    \n01 열정과 혁신\n동촌은 작은 골프장이지만 저희에게 골프는 모든 것입니다. 그래서 저희의 모든 열정을 헌신합니다. 마치 가족처럼, 고향 마을처럼, 동촌을 사랑하는 골퍼들과 쌓아가는 시간들이 저희는 자랑스럽습니다.\n\n02 골프 에티켓의 준수\n골프에서 가장 중요한 원칙은 코스에서 항상 다른 플레이어를 배려하는 일입니다. 이를 위해 동촌은 골퍼의 안전과 원활한 경기흐름, 코스의 보호를 최우선 과제로 여기며 함께 지켜나갈 것을 약속합니다.\n\n03 언제나 쾌적한 대회코스의 실현\n동촌은 최적의 코스 컨디션 유지를 위해 다양한 골프 대회를 정기적으로 개최하는 원칙을 고수합니다. 이러한 전통을 기반으로 관리되는 동촌의 코스품질 기준은 골퍼에게 언제나 쾌적한 라운드 가치를 제공합니다.\n\n04 정성스런 F&B 서비스의 구현\n우리가 추구하는 F&B 서비스 본질은 ‘소박함’과 ‘정성’입니다. 계절을 담아내는 ‘맛’과 인연을 쌓아가는 ‘정’을 통해 동촌에서의 한끼를 더욱 가치 있게 만드는 ‘아주 작은 차이’ 를 만들어냅니다.\n\n05 REWARD & PRIVILEGE\n골퍼가 플레이 하는 매 라운드는 본질적으로 서로 다른 가치를 지닙니다. 이러한 가치의 차이가 만드는 결과를 고객에게 돌려드리기 위해 저희는 합리적이고 공정한 보상 체계와 특별한 혜택을 제공합니다.\n\n06 서비스의 장인정신\n동촌이 만들어가는 코스와 서비스 그리고 문화는 장인정신을 근본으로 하고 있습니다. 마지막 순간까지 책임지고 보이지 않는 곳까지 배려하는 정신은 동촌인의 기본 자세이자 철학입니다. 머무르는 모든 순간에 아름다운 디테일과 감동을 더하기 위해 진실된 마음으로 끈임 없는 노력을 다하겠습니다.',
      created_at: '2022-01-23T11:56:43.000Z',
      updated_at: '2022-01-23T11:56:43.000Z',
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
