import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }: any) => {
  const isOwner = await ctx.prisma.organization.findMany({
    where: {
      owner: {
        id: user.id
      }
    },
    select: {
      id: true
    }
  })
  if(!!isOwner.length) return ctx.prisma.organization.update({ data, where })
  else throw new Error("You are not the organization owner");
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
