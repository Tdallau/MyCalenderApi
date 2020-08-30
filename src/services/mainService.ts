import IMainService from "../interfaces/iMainService";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

const mainService: IMainService = {
  sleep: (ms: number) => new Promise((res) => setTimeout(res, ms)),
  // @ts-ignore
  checkToken: (req: Request,res: Response,next: NextFunction) => {
    const token = req.header('Authorization');
    const jwtToken = token?.split(' ')[1];
    if(jwtToken !== undefined) {
      const data = jwt.decode(jwtToken) as { [key: string]: any; };
      const expDate = new Date(+data['exp'] * 1000);
      const today = new Date();

      if(today > expDate) {
        return res.status(401).json({success: false, error: "Token is verlopen"})
      }
      next();
    } else {
      return res.status(403).send({
        success: false,
        error: 'Er is geen token gevonden'
    });
    }
  }
}

export default mainService;