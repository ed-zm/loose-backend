import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }: any) => {
  const isCreator = await ctx.prisma.$exists.task({
    createdBy: {
      id: user.id
    }
  })
  if(isCreator) return ctx.prisma.updateLabel({ data, where })
  else throw new Error("You are not the task creator");
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
