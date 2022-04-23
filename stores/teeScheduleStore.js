const { makeObservable, observable, computed, action } = require('mobx');

class TeeScheduleStore {
  _golfSchedule = {}; // tee_id, id, date, time, others, persons, fee_normal
  _teeSchedule = {}; // id : golfSchedule
  _teeScheduleList = []; // teeSchedule[]

  constructor() {
    makeObservable(this, {
      _golfSchedule: observable,
      _teeSchedule: observable,
      _teeScheduleList: observable,
      golfSchedule: computed,
      teeSchedule: computed,
      teeScheduleList: computed,
      isEmpty: computed,
      setTeeScheduleList: action,
    });
  }

  get golfSchedule() {
    return this._golfSchedule;
  }

  get teeSchedule() {
    return this._teeSchedule;
  }

  get teeScheduleList() {
    return this._teeScheduleList;
  }

  get isEmpty() {
    return this._teeScheduleList?.length === 0;
  }

  setTeeScheduleList(teeScheduleList) {
    this._teeScheduleList = teeScheduleList;
  }
}

const teeScheduleStore = new TeeScheduleStore();
export default teeScheduleStore;
