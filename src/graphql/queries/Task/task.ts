import { arg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where }, ctx, user }: any) => {
  const canView = ctx.prisma.$exists.task({
    ...where,
    OR: [
      { createdBy: { id: user.id } },
      { assignedTo: {id: user.id } },
      { organization: {
        users_some: {
          id: user.id
        }
      }}
    ]
  })
  if(canView) {
    const task = await ctx.prisma.task({ ...where })
    return task
  }
  throw new Error('Unauthorized')
}


export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
