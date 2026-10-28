  import {prismaClient} from "../../../Prisma";


interface AddToWaitlistProps {
  email: string
}

const AddToWaitlistService = {
  execute: async ({ email }: AddToWaitlistProps) => {
    const emailAlreadyExists = await prismaClient.waitlist.findUnique({
      where: {
        email:email
      }
    })

    if (emailAlreadyExists) {
      throw new Error('Email is already on the waitlist!')
    }

    const waitlistEntry = await prismaClient.waitlist.create({
      data: {
        email:email
      },
      select:
      {
        id:true,
        email:true,
        createdAt:true
     }
    })

    return waitlistEntry
  }
}

export { AddToWaitlistService }