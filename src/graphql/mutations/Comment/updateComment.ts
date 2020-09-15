import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }: any) => {
  const isCreator = await ctx.prisma.$exists.comment({
    user: {
      id: user.id
    }
  })
  if(isCreator) return ctx.prisma.updateComment({ data, where })
  else throw new Error("You are not the comment creator");
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
