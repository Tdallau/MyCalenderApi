import { Request, Response } from "express"
import mainService from "../services/mainService"

export const getCalender = async (req: Request, res: Response): Promise<void> => {
  await mainService.sleep(200);
  const calender: Calender = {
     id: +req.params.id,
     name: 'Feyenoord',
     fileName: 'feyenoord.ics'
  }
  res.status(200).json(calender)
}