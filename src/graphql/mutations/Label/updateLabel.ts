import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }: any) => {
  const isCreator = await ctx.prisma.task.findMany({
    where: {
      createdBy: {
        id: user.id
      }
    },
    select: {
      id: true
    }
  })
  if(!!isCreator.length) return ctx.prisma.label.update({ data, where })
  else throw new Error("You are not the task creator");
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
