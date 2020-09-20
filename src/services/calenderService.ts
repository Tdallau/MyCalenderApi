import { iCalenderService } from "../interfaces/iCalenderService";
import * as ics from 'ics';
import Axios from "axios";
// import fileUpload from "express-fileupload";
import { existsSync, unlinkSync, mkdirSync, writeFileSync } from "fs";

const calenderService: iCalenderService = {
  getAllCalenders: async (auth: string | undefined = undefined): Promise<Calender[]> => {
    let headers = {};
    if(auth !== undefined) {
      headers = {
        Authorization: auth
      }
    }
    const response = await Axios.get<any>('https://home.dallau.com/mycalender/calender', {
      headers
    })
    return response.data.data.list;
  },
  addCalenderToDB: async (cal, auth): Promise<Calender> => {
    const calenders = await calenderService.getAllCalenders()
    if(calenders.find(x => x.fileName === cal.fileName) !== undefined) {
      console.log('already added to db');
      return new Promise((res) => {
        return res({
          id: -1,
          fileName: cal.fileName,
          name: cal.name
        })
      })
    }
    return await Axios.post('https://home.dallau.com/mycalender/calender', cal, {
      headers: {
        Authorization: auth
      }
    })
  },
  createCalender: (data, name, callback): void => {
    ics.createEvents(data, (error, value) => {
      if (error) {
        callback(error)
        return;
      }
      if (existsSync(`${__dirname}/../files/${name}.ics`)) {
        unlinkSync(`${__dirname}/../files/${name}.ics`);
      }
      if (!existsSync(`${__dirname}/../files`)) {
        mkdirSync(`${__dirname}/../files`);
      }
  
      writeFileSync(`${__dirname}/../files/${name}.ics`, value);
      callback();
    });
  },
  saveCalender: (file, name, callback) => {
    file.mv(`${__dirname}/../files/${name}.ics`, callback);
  }
}

export default calenderService;