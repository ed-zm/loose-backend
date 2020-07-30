import { arg, intArg, stringArg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args, ctx, user }) => {
  return ctx.prisma.commentsConnection(args)
}

export default {
  type: "CommentConnection",
  args: {
    where: arg({ type: 'CommentWhereInput' }),
    orderBy: arg({ type: 'CommentOrderByInput' }),
    skip: intArg(),
    after: stringArg(),
    before: stringArg(),
    first: intArg(),
    last: intArg()
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
