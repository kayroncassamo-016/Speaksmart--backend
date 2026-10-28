

import { Router } from 'express'

import { validateSchema } from './src/middleware/validateSchema'
import { waitlistSchema } from './src/schemas/waitListSchema'
import { GetWaitlistController } from "./src/controller/waitlist/GetWaitlistController"


import { AddToWaitlistController } from './src/controller/waitlist/AddToWaitlistController'

const router = Router()



router.post(
  '/joinwaitlist', validateSchema(waitlistSchema), new AddToWaitlistController().handle
)

router.get(
  '/waitlist', new GetWaitlistController().handle
)

export { router }