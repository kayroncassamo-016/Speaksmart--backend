

import { Router } from 'express'

import { AdminAuthController } from './src/controller/admin/AdminAuthController'
import { requireAdmin } from './src/middleware/requireAdmin'

import { validateSchema } from './src/middleware/validateSchema'
import { waitlistSchema } from './src/schemas/waitListSchema'
import { GetWaitlistController } from "./src/controller/waitlist/GetWaitlistController"


import { AddToWaitlistController } from './src/controller/waitlist/AddToWaitlistController'

const router = Router()
const adminAuthController = new AdminAuthController()


router.post(
  '/joinwaitlist', validateSchema(waitlistSchema), new AddToWaitlistController().handle
)

router.get(
  '/waitlist',requireAdmin, new GetWaitlistController().handle
)

router.post('/admin/login', adminAuthController.login)

router.get('/admin/session', adminAuthController.session)

router.post('/admin/logout', adminAuthController.logout)


export { router }