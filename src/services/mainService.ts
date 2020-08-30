import IMainService from "../interfaces/iMainService";

const mainService: IMainService = {
  sleep: (ms: number) => new Promise((res) => setTimeout(res, ms))
}

export default mainService;