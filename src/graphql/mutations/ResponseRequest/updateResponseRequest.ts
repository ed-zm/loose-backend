import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }: any) => {
  const isOwner = await ctx.prisma.$exists.responseRequest({
    assignedTo: {
      id: user.id
    }
  })
  if(isOwner) return ctx.prisma.updateResponseRequest({ data, where })
  else throw new Error("You are not the task creator");
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
