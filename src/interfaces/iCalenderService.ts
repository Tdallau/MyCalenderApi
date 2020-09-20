import * as ics from 'ics';
import fileUpload from "express-fileupload";
import { CalenderCreateRequest } from '../models/calenderCreateRequest';

export interface iCalenderService {
  getAllCalenders: (auth?: string | undefined) => Promise<Calender[]>;
  addCalenderToDB: (cal: CalenderCreateRequest,auth: string) => Promise<Calender>;
  createCalender: (data: ics.EventAttributes[], name: string, callback: (err?: any) => void) => void;
  saveCalender: (file: fileUpload.UploadedFile, name: string, callback: (err?: any) => void) => void;
}