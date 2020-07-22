import { arg } from 'nexus'
import prisma from '../../../prisma'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where, ...args }, ctx, user }) => {
  if(user) {
  const tasks = await ctx.prisma.tasks({
      where: {
        ...where,
        OR: [
          { createdBy: { id: user.id } },
          { assignedTo: {id: user.id } }
        ]
      },
      ...args
    })
    return tasks
  } else {
    return []
  }
}


export default {
  type: "Task",
  list: true,
  args: {
    where: arg({ type: 'TaskWhereUniqueInput' })
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
