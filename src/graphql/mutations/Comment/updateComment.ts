import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }) => {
  const isCreator = await ctx.prisma.$exists.comment({
    user: {
      id: user.id
    }
  })
  if(isCreator) return ctx.prisma.updateComment({ data, where })
  else throw new Error("You are not the comment creator");
}

export default {
  type: "Comment",
  args: {
    data: arg({ type: 'CommentUpdateInput' }),
    where: arg({ type: 'CommentWhereUniqueInput'})
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
