import { Request, Response } from 'express';
import fileUpload from 'express-fileupload';
// import { readFile } from 'fs/promises';
import mainService from '../services/mainService';
import { readFile, existsSync } from 'fs';
import { generateIcs } from '../callender';
import calenderService from '../services/calenderService';
import {
  CalenderJsonRequest,
  CalenderCreateRequest,
} from '../models/calenderCreateRequest';

export const getAllCalenders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const calenders = await calenderService.getAllCalenders();
  res.status(200).json(calenders);
};

export const getCalender = async (
  req: Request,
  res: Response
): Promise<void> => {
  // get calender data from home.dallau.com

  const calenders = await calenderService.getAllCalenders();
  const calender = calenders.find((x) => x.id === +req.params.id);
  if (calender === undefined || calender === null) {
    res.status(404).json({
      success: false,
      error: `Er is geen calender gevonden met het gebruikte id`,
    });
    return;
  }
  if (!existsSync(`${__dirname}/../files/${calender.fileName}.ics`)) {
    res.status(404).json({
      success: false,
      error: `Er bestaat geen agenda genaamd ${calender.name}`,
    });
    return;
  }
  res.download(`${__dirname}/../files/${calender.fileName}.ics`);
};

export const getCalenderData = async (req: Request, res: Response) => {
  // get calender data from home.dallau.com
  const calenders = await calenderService.getAllCalenders();
  const calender = calenders.find((x) => x.id === +req.params.id);
  if (calender === undefined || calender === null) {
    res.status(404).send('calender niet gevonden');
    return;
  }

  readFile(
    `${__dirname}/../files/${calender.fileName}.ics`,
    async (err, dataBuffer) => {
      if (err) {
        res.send(err);
        return;
      }
      const data = dataBuffer.toString();
      const array = data.split('\n');
      const events = [];
      let start = 0;
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        const split = element.split(':');
        const key = split[0];

        if (key === 'UID' || i + 1 === array.length) {
          const event = await mainService.createEvent(
            array.slice(start, i - 1)
          );
          if (Object.keys(event).length > 0) {
            events.push(event);
          }
          start = i;
        }
      }
      res.status(200).json(events);
    }
  );
};

export const createCalenderIcs = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  const calender = req.files.calender as fileUpload.UploadedFile;
  const body = req.body as CalenderCreateRequest;
  const auth = req.header('Authorization');
  // use fileName instead of f1.ics `${req.body.fileName}.ics`
  calenderService.saveCalender(calender, body.fileName, async (err) => {
    if (err) res.status(500).send(err);
    //send request to home.dallau.com for creating calender
    await calenderService.addCalenderToDB(body, auth as string);
    res.send('File uploaded!');
  });
};

export const createCalenderJson = async (
  req: Request,
  res: Response
): Promise<void> => {
  const data = req.body as CalenderJsonRequest;
  const auth = req.header('Authorization');
  if (data && data.events && data.events.length > 0) {
    const list = [];
    for (const event of data.events) {
      list.push(mainService.createIcsEvent(event, data.name));
    }
    // create ics file
    calenderService.createCalender(list, data.name, async (err) => {
      if (err) {
        res.status(400).send(err);
        return;
      }
      // send request to home.dallau.com for creating calender
      try {
        data.events = [];
        await calenderService.addCalenderToDB(data, auth as string);
      } catch (error) {
        res.status(400).send(error.request.data);
        return;
      }
      res.json({ success: true, data: 'Calender is aangemaakt' });
    });
  } else {
    res
      .status(404)
      .json({ success: false, error: 'Er is geen evenement mee gegeven' });
  }
};

export const temp = async (_req: Request, res: Response): Promise<void> => {
  generateIcs();
  res.send('dit is een test');
};
