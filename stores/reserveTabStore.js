const { makeObservable, observable, computed, action } = require('mobx');

class ReserveTabStore {
  myReserveList = [];
  selectedReserve = null;
  isFirstTabMove = true;
  deviceId = "";

  constructor() {
    makeObservable(this, {
      myReserveList: observable,
      selectedReserve: observable,
      setMyReserveList: action,
      setSelectReserve: action,
    });
  }

  setMyReserveList(list) {
    this.myReserveList = list;
  }

  setSelectReserve(item) {
    this.selectedReserve = item;
  }

}

const reserveTabStore = new ReserveTabStore();
export default reserveTabStore;
