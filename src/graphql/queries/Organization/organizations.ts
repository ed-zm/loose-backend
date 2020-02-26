import { arg, intArg, stringArg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async (_, { where = {}, ...rest }, ctx, info) => {
  const user = await authenticate(ctx)
  return ctx.prisma.organizations({
    where: {
      ...where,
      owner: {
        id: user ? user.id : ''
      }
    },
    ...rest
  }, info)
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
  resolve
}
