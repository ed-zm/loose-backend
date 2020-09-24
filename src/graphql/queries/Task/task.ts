import { arg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where }, ctx, user }: any) => {
  const canView = await ctx.prisma.task.findMany({
    where: {
      ...where,
      OR: [
        { createdBy: { id: user.id } },
        { assignedTo: {id: user.id } },
        { organization: {
          users: {
            some: { id: { equals: user.id } }
          }
        }}
      ]
    },
    select: {
      id: true
    }
  })
  if(!!canView.length) {
    const task = await ctx.prisma.task.findOne({ where })
    return task
  }
  throw new Error('Unauthorized')
}


export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
