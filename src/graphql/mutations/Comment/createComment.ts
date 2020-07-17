import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data }, ctx, user }) => {
  if(data.user && data.user.connect && data.user.connect.id && data.user.connect.id !== user.id) {
    throw new Error(`You can't create a comment for other users`)
  }
  return ctx.prisma.createComment({
    ...data,
    user: {
      //@ts-ignore
      connect: { id: user ? user.id : '' }
    }
  })
}

export default {
  type: "Comment",
  args: {
    data: arg({ type: 'CommentCreateInput' })
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
