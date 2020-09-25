import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }: any) => {
  const isOwner = await ctx.prisma.responseRequest.findMany({
    where: {
      assignedTo: {
        id: user.id
      }
    },
    select: {
      id: true
    }
  })
  if(!!isOwner.length) return ctx.prisma.responseRequest.update({ data, where })
  else throw new Error("You are not the task creator");
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
