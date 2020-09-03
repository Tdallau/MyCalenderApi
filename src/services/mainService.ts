import IMainService from '../interfaces/iMainService';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as ics from 'ics';
import icsService from './icsService';
import moment from 'moment-timezone';

const mainService: IMainService = {
  sleep: (ms: number) => new Promise((res) => setTimeout(res, ms)),
  // @ts-ignore
  checkToken: (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    const jwtToken = token?.split(' ')[1];
    if (jwtToken !== undefined) {
      const data = jwt.decode(jwtToken) as { [key: string]: any };
      const expDate = new Date(+data['exp'] * 1000);
      const today = new Date();

      if (today > expDate) {
        return res
          .status(401)
          .json({ success: false, error: 'Token is verlopen' });
      }
      next();
    } else {
      return res.status(403).send({
        success: false,
        error: 'Er is geen token gevonden',
      });
    }
  },
  createEvent: async (
    events: string[]
  ): Promise<{ [field: string]: any }> => {
    const dict: { [field: string]: any } = {};
    for (const event of events) {
      const split = event.split(':');
      const key = split[0];
      const value = split[1];
      if (
        key === 'SUMMARY' ||
        key === 'DTSTAMP' ||
        key === 'DTSTART' ||
        key === 'DESCRIPTION' ||
        key === 'LOCATION' ||
        key === 'DURATION' ||
        key === 'DTEND' ||
        key === 'CATEGORIES'
      ) {
        //moment.tz(dateString, "Europe/Paris")
        if(key === 'DTSTAMP' ||
        key === 'DTSTART') {
          dict[key] = moment.tz(value.replace('\r', ''), "Europe/Paris");
        } else {
          dict[key] = value.replace('\r', '');
        }
        
      }
    }

    return dict;
  },
  createIcsEvent: (event: {[field: string]: string}, name: string): ics.EventAttributes => {

    const obj: ics.EventAttributes = {
      duration: icsService.getDuration(event['DURATION']),
      start: icsService.getDate(event['DTSTART']),
      end: event['DTEND'] ? icsService.getDate(event['DTEND']) : undefined,
      categories: event['CATEGORIES'] ? event['CATEGORIES'].split(',') : undefined,
      location: event['LOCATION'],
      description: event['DESCRIPTION'],
      title: event['SUMMARY'],
      calName: name
    }
    const ics: {[key: string]: any} = {};
    for (const key of Object.keys(obj)) {
      const field = key as keyof ics.EventAttributes;
      if(obj[field] !== undefined) {
        ics[field] = obj[field];
      }
    }
    return ics as ics.EventAttributes
  },
};

export default mainService;
