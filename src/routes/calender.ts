import { Router } from "express";
import { getCalender, createCalenderIcs, getCalenderData, createCalenderJson } from "../controllers/calenderController";
// import mainService from "../services/mainService";

const calenderRouter: Router = Router();
// calenderRouter.use(mainService.checkToken);

calenderRouter.get('/subscribe/:id', getCalender);
calenderRouter.get('/data/:id', getCalenderData);
calenderRouter.post('/', createCalenderIcs);
calenderRouter.post('/json', createCalenderJson);

export default calenderRouter;