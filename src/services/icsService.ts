import IIcsService from '../interfaces/iIcsService';
import * as ics from 'ics';
import { isNumber } from 'util';
import moment from 'moment-timezone';

const icsService: IIcsService = {
  getDuration: (dur: string): ics.DurationObject | null => {
    if (dur) {
      const value = dur.replace('PT', '');
      const hourIndex = value.indexOf('H');
      const minuteIndex = value.indexOf('M');
      const secondIndex = value.indexOf('S');
      const durationObject: ics.DurationObject = {};
      if (hourIndex !== -1) {
        if (
          hourIndex - 2 >= 0 &&
          isNumber(+value.slice(hourIndex - 2, hourIndex))
        ) {
          durationObject['hours'] = +value.slice(hourIndex - 2, hourIndex);
        } else {
          durationObject['hours'] = +value.slice(hourIndex - 1, hourIndex);
        }
      }
      if (minuteIndex !== -1) {
        if (
          minuteIndex - 2 >= 0 &&
          isNumber(+value.slice(minuteIndex - 2, minuteIndex))
        ) {
          durationObject['minutes'] = +value.slice(
            minuteIndex - 2,
            minuteIndex
          );
        } else {
          durationObject['minutes'] = +value.slice(
            minuteIndex - 1,
            minuteIndex
          );
        }
      }
      if (secondIndex !== -1) {
        if (
          secondIndex - 2 >= 0 &&
          isNumber(+value.slice(secondIndex - 2, secondIndex))
        ) {
          durationObject['seconds'] = +value.slice(
            secondIndex - 2,
            secondIndex
          );
        } else {
          durationObject['seconds'] = +value.slice(
            secondIndex - 1,
            secondIndex
          );
        }
      }
      const rtr: ics.DurationObject = {};
      for (const duration of Object.keys(durationObject)) {
        const d = duration as 'hours' | 'minutes' | 'seconds';
        const value = durationObject[d] as number;
        if (isNaN(value)) {
          rtr[d] = 0;
        } else {
          rtr[d] = value;
        }
      }
      return rtr;
    }
    return null;
  },
  getDate: (dateString: string): ics.DateArray => {
    const covert = moment.tz(dateString, 'Europe/Paris');
    // console.log(covert.utcOffset())

    const dateArray: ics.DateArray = [
      covert.year(),
      covert.month() + 1,
      covert.date(),
      covert.hour(),
      covert.minute(),
    ];
    return dateArray;
  },
};

export default icsService;
