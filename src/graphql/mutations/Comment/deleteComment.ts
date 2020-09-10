import { arg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where }, ctx, user }) => {
  const isCreator = await ctx.prisma.$exists.comment({
    user: {
      id: user.id
    }
  })
  if(isCreator) return ctx.prisma.deleteComment(where)
  else throw new Error("You are not the comment creator");
}

export default {
  type: "Comment",
  args: {
    where: arg({ type: 'CommentWhereUniqueInput'})
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
