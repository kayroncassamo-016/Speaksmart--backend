
  import {prismaClient} from "../../../Prisma";


const GetWaitlistService = {
  execute: async () => {
    return prismaClient.waitlist.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  },
}

export { GetWaitlistService }