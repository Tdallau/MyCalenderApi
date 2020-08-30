import { Router } from "express";
import { getCalender } from "../controllers/calenderController";
import mainService from "../services/mainService";

const calenderRouter: Router = Router();
calenderRouter.use(mainService.checkToken);

calenderRouter.get('/:id', getCalender);

export default calenderRouter;