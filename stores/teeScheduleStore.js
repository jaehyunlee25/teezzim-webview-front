const { makeObservable, observable, computed, action } = require('mobx');

class TeeScheduleStore {
  _teeSchedules = {}; // id : golfSchedule
  _date;

  constructor() {
    makeObservable(this, {
      _teeSchedules: observable,
      _date: observable,

      teeSchedules: computed,
      date: computed,
      currentTeeSchedules: computed,
      isEmpty: computed,

      setTeeSchedules: action,
      setDate: action,
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

  setDate(date) {
    this._date = date;
  }

  setTeeSchedules(teeSchedules) {
    this._teeSchedules = { ...this._teeSchedules, [this.date]: teeSchedules };
  }
}

const teeScheduleStore = new TeeScheduleStore();
export default teeScheduleStore;
