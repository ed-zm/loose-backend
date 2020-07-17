import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }) => {
  const isMember = await ctx.prisma.$exists.team({
    users_some: {
      id: user.id
    }
  })
  if(isMember) return ctx.prisma.updateTeam({ data, where })
  else throw new Error("You are not a team member");
}

export default {
  type: "Team",
  args: {
    data: arg({ type: 'TeamUpdateInput' }),
    where: arg({ type: 'TeamWhereUniqueInput'})
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
