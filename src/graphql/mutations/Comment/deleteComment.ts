import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where }, ctx, user }: any) => {
  const isCreator = await ctx.prisma.comment.findMany({
    where: {
      user: {
        id: user.id
      }
    },
    select: {
      id: true
    }
  })
  if(!!isCreator.length) return ctx.prisma.comment.delete({where})
  else throw new Error("You are not the comment creator");
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
