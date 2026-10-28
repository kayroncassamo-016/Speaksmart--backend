// import {z} from 'zod';

// const waitlistSchema = z.object({
//   body: z.object({
//     email: z
//       .string({ message: 'Email must be a text' })
//       .min(1, { message: 'Email is required' })
//       .email({ message: 'Please provide a valid email address' })
//   })
// })

// export { waitlistSchema }


import { z } from 'zod'

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

const waitlistSchema = z.object({
  body: z.object({
    email: z
      .string({ message: 'Email must be a text' })
      .trim()
      .min(1, { message: 'Email is required' })
      .max(254, { message: 'Email is too long' })
      .regex(emailRegex, {
        message: 'Please provide a valid email address'
      })
      .toLowerCase()
  })
})

export { waitlistSchema }

// reject:
// abc                    ❌
// abc@                   ❌
// abc@gmail              ❌
// abc@mail               ❌
// abc@a.c                ❌
// abc @gmail.com         ❌
// abc@gmail.             ❌
// abc@gmail.c             ❌
// abc@@gmail.com         ❌
// abc@gmail..com         ❌

// accept:
// kayron@gmail.com       ✅
// kayron@yahoo.com       ✅
// kayron@outlook.com     ✅
// kayron@proton.me       ✅
// kayron@empresa.co.mz   ✅
// kayron@empresa.co.uk   ✅
// kayron@empresa.org     ✅

