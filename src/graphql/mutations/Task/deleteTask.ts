import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where }, ctx, user }: any) => {
  const isCreator = await ctx.prisma.$exists.task({
    createdBy: {
      id: user.id
    }
  })
  if(isCreator) return ctx.prisma.deleteTask(where)
  else throw new Error("You are not the task creator");
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
