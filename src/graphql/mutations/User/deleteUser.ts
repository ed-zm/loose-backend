import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where }, ctx, user }) => {
  const isUser = await ctx.prisma.$exists.user({
    id: user.id
  })
  if(isUser) return ctx.prisma.deleteUser(where)
  else throw new Error("You are not the user");
}

export default {
  type: "User",
  args: {
    where: arg({ type: 'UserWhereUniqueInput'})
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
