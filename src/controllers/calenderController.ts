import { Request, Response } from 'express';
import { calenders } from '../helpers/data';
import fileUpload from 'express-fileupload';
import { readFile } from 'fs/promises';
import mainService from '../services/mainService';

export const getCalender = async (
  req: Request,
  res: Response
): Promise<void> => {
  const calender = calenders.find((x) => x.id === +req.params.id);
  if (calender === undefined || calender === null) {
    res.status(404).send('calender niet gevonden');
    return;
  }
  res.download(`${__dirname}/../files/${calender.fileName}.ics`);
};

export const getCalenderData = async (req: Request, res: Response) => {
  const calender = calenders.find((x) => x.id === +req.params.id);
  if (calender === undefined || calender === null) {
    res.status(404).send('calender niet gevonden');
    return;
  }

  const dataBuffer = await readFile(
    `${__dirname}/../files/${calender.fileName}.ics`
  );
  const data = dataBuffer.toString();
  const array = data.split('\n');
  const events = [];
  let start = 7;
  for (let i = 7; i < array.length; i++) {
    const element = array[i];
    const split = element.split(':');
    const key = split[0];

    if (key === 'UID' || i + 1 === array.length) {
      const event = await mainService.createEvent(array.slice(start, i - 1));
      if (Object.keys(event).length > 0) {
        events.push(event);
      }
      start = i;
    }
  }
  res.status(200).json(events);
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
  calender.mv(`${__dirname}/../files/f1.ics`, (err) => {
    if (err) res.status(500).send(err);
    res.send('File uploaded!');
  });
};

export const createCalenderJson = async (
  req: Request,
  res: Response
): Promise<void> => {
  const events = req.body as [];
  if (events && events.length > 0) {
    const list = [];
    for (const event of events) {
      list.push(mainService.createIcsEvent(event))
    }
    res.send(list);
  } else {
    res.status(404).json({success: false, error: 'Er is geen evenement mee gegeven'})
  }
};
