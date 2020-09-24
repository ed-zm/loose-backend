import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where }, ctx, user }: any) => {
  const isOwner = await ctx.prisma.organization.findMany({
    where: {
      owner: {
        id: { equals: user.id }
      }
    },
    select: {
      id: true
    }
  })
  if(!!isOwner.length) return ctx.prisma.organization.delete({ where })
  else throw new Error("You are not the organization owner");
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
