
import type { Request, Response } from "express"
import { GetWaitlistService } from "../../services/waitlist/GetWaitlistService"

class GetWaitlistController {
  async handle(_req: Request, res: Response) {
    const waitlist = await GetWaitlistService.execute()

    return res.status(200).json(waitlist)
  }
}

export { GetWaitlistController }
