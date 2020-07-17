import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where }, ctx, user }) => {
  const isCreator = await ctx.prisma.$exists.task({
    createdBy: {
      id: user.id
    }
  })
  if(isCreator) return ctx.prisma.deleteTask(where)
  else throw new Error("You are not the task creator");
}

export default {
  type: "Task",
  args: {
    where: arg({ type: 'TaskWhereUniqueInput'})
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
