const { makeObservable, observable, computed, action } = require('mobx');

class TeeScheduleStore {
  _teeSchedules = {}; // id : golfSchedule
  _date;
  _times = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];
  _areas = ['수도권', '강원도', '충청도', '영남권', '호남권', '제주도'];

  constructor() {
    makeObservable(this, {
      _teeSchedules: observable,
      _date: observable,
      _times: observable,
      _areas: observable,

      teeSchedules: computed,
      date: computed,
      currentTeeSchedules: computed,
      isEmpty: computed,
      times: computed,
      areas: computed,

      setTeeSchedules: action,
      setDate: action,
      addTimes: action,
      removeTimes: action,
      addAreas: action,
      removeAreas: action,
    });
  }

  get teeSchedules() {
    return this._teeSchedules;
  }

  get date() {
    return this._date;
  }

  get currentTeeSchedules() {
    return this._teeSchedules?.[this.date] ?? {};
  }

  get isEmpty() {
    return Object.keys(this.currentTeeSchedules).length === 0;
  }

  get times() {
    return this._times;
  }

  get areas() {
    return this._areas;
  }

  setDate(date) {
    this._date = date;
  }

  setTeeSchedules(teeSchedules) {
    this._teeSchedules = { ...this._teeSchedules, [this.date]: teeSchedules };
  }

  addTimes(times = []) {
    this._times = [...new Set([...this._times, ...times])];
  }

  removeTimes(times = [], clear = false) {
    if (clear) this._times = [];
    else this._times = this._times.filter(time => !times.includes(time));
  }

  addAreas(areas = []) {
    this._areas = [...new Set([...this._areas, ...areas])];
  }

  removeAreas(areas = [], clear = false) {
    if (clear) this._areas = [];
    else this._areas = this._areas.filter(area => !areas.includes(area));
  }
}

const teeScheduleStore = new TeeScheduleStore();
export default teeScheduleStore;
