import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }) => {
  const isOwner = await ctx.prisma.$exists.responseRequest({
    assignedTo: {
      id: user.id
    }
  })
  if(isOwner) return ctx.prisma.updateResponseRequest({ data, where })
  else throw new Error("You are not the task creator");
}

export default {
  type: "ResponseRequest",
  args: {
    data: arg({ type: 'ResponseRequestUpdateInput' }),
    where: arg({ type: 'ResponseRequestWhereUniqueInput'})
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
