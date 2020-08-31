import { Request, Response, NextFunction } from "express";
import * as ics from 'ics';

interface IMainService {
  sleep: (ms: number) => Promise<void>;
  checkToken: (req: Request,res: Response,next: NextFunction) => any;
  createEvent: (events: string[]) => Promise<{ [field: string]: string }>;
  createIcsEvent: (event: {[field: string]: string}) => ics.EventAttributes;
}

export default IMainService;