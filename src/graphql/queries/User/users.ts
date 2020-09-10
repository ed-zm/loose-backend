import { arg, intArg, stringArg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args, ctx, user }) => {
  return ctx.prisma.usersConnection({
    ...args,
    where: {
      ...args.where,
      emailVerifiedAt_not: null
    }
  })
}

export default {
  type: "UserConnection",
  args: {
    where: arg({ type: 'UserWhereInput' }),
    orderBy: arg({ type: 'UserOrderByInput' }),
    skip: intArg(),
    after: stringArg(),
    before: stringArg(),
    first: intArg(),
    last: intArg()
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
