import { arg, intArg, stringArg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where = {}, ...rest }, ctx, user }) => {
  return ctx.prisma.organizations({
    where: {
      ...where,
      owner: {
        id: user ? user.id : ''
      }
    },
    ...rest
  })
}

export default {
  type: "Organization",
  list: true,
  args: {
    where: arg({ type: 'OrganizationWhereInput' }),
    orderBy: arg({ type: 'OrganizationOrderByInput' }),
    skip: intArg(),
    after: stringArg(),
    before: stringArg(),
    first: intArg(),
    last: intArg()
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
