import * as ics from 'ics';

interface IIcsService {
  getDuration: (dur: string) => ics.DurationObject;
  getDate: (dateString: string) => ics.DateArray;
}

export default IIcsService;