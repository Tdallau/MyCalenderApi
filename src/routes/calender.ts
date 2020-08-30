import { Router } from "express";
import { getCalender } from "../controllers/calenderController";

const calenderRouter: Router = Router();

calenderRouter.get('/:id', getCalender);

export default calenderRouter;