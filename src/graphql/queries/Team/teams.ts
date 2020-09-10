import { arg, intArg, stringArg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args, ctx, user }) => {
  return ctx.prisma.teamsConnection({ ...args })
}

export default {
  type: "TeamConnection",
  args: {
    where: arg({ type: 'TeamWhereInput' }),
    orderBy: arg({ type: 'TeamOrderByInput' }),
    skip: intArg(),
    after: stringArg(),
    before: stringArg(),
    first: intArg(),
    last: intArg()
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
