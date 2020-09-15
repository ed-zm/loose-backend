import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }: any) => {
  const isUser = await ctx.prisma.$exists.user({
    id: user.id
  })
  if(isUser) return ctx.prisma.updateUser({ data, where })
  else throw new Error("You are not the user");
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
