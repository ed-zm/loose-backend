import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }: any) => {
  const isMember = await ctx.prisma.team.findMany({
    where: {
      users: {
        some: {
          id: user.id
        }
      }
    }
  })
  if(!!isMember.length) return ctx.prisma.team.update({ data, where })
  else throw new Error("You are not a team member");
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
