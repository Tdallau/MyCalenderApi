import { Request, Response } from 'express';

export const getCalender = async (
  req: Request,
  res: Response
): Promise<void> => {

  const calender: Calender = {
    id: +req.params.id,
    name: 'Feyenoord',
    fileName: 'feyenoord.ics',
  };
  res.status(200).json(calender);
};
