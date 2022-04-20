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
    return this._teeScheduleList.length === 0;
  }

  setTeeScheduleList(teeScheduleList) {
    this._teeScheduleList = teeScheduleList ?? [
      {
        id: '6cbc1160-79af-11ec-b15c-0242ac110005',
        golf_club_name: '아일랜드CC',
        date: '2022-02-07',
        golf_course_name: 'EAST 코스',
        time: '13:43:00',
        fee_normal: 150000,
        fee_discount: 150000,
        others: null,
        create_at: '2022-02-05T16:45:43.000Z',
      },
    ];
    // this._teeSchedule = this._teeScheduleList.reduce(
    //   (acc, { id, GolfSchedules }) => {
    //     const tee_id = id;
    //     return {
    //       ...acc,
    //       ...GolfSchedules.reduce(
    //         (schedules, { id, ...others }) => ({
    //           ...schedules,
    //           [id]: {
    //             tee_id,
    //             id,
    //             ...others,
    //           },
    //         }),
    //         {},
    //       ),
    //     };
    //   },
    //   this._teeSchedule,
    // );
  }
}

const teeScheduleStore = new TeeScheduleStore();
export default teeScheduleStore;
