import { arg } from 'nexus'
import prisma from '../../../prisma'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where }, ctx, user }) => {
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
  type: "Task",
  args: {
    where: arg({ type: 'TaskWhereUniqueInput' })
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
