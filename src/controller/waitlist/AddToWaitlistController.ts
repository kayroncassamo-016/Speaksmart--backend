import  { Request, Response } from 'express'

import { AddToWaitlistService } from '../../services/waitlist/AddWaitlistService'

class AddToWaitlistController {
  async handle(req: Request, res: Response) {

    const { email } = req.body

    const waitlistEntry = await AddToWaitlistService.execute({
      email
    })

    return res.status(200).json(waitlistEntry)
  }
}

export { AddToWaitlistController }