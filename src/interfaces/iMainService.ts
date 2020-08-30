import { Request, Response, NextFunction } from "express";

interface IMainService {
  sleep: (ms: number) => Promise<void>;
  checkToken: (req: Request,res: Response,next: NextFunction) => any
}

export default IMainService;