import { Router } from "express";
import { getCalender, createCalenderIcs, getCalenderData, createCalenderJson, getAllCalenders, getMyCalenders } from "../controllers/calenderController";
import mainService from "../services/mainService";
// import mainService from "../services/mainService";

const calenderRouter: Router = Router();
calenderRouter.get('/subscribe/:id', getCalender);
calenderRouter.get('/', getAllCalenders);

calenderRouter.use(mainService.checkToken);
calenderRouter.get('/my', getMyCalenders);

calenderRouter.get('/data/:id', getCalenderData);
calenderRouter.post('/', createCalenderIcs);
calenderRouter.post('/json', createCalenderJson);
// calenderRouter.get('/', temp);

export default calenderRouter;