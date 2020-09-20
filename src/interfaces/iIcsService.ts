import * as ics from 'ics';

interface IIcsService {
  getDuration: (dur: string) => ics.DurationObject | null;
  getDate: (dateString: string) => ics.DateArray;
}

export default IIcsService;