import { arg, intArg, stringArg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where = {}, ...rest }, ctx, user }) => {
  return ctx.prisma.organizationsConnection({
    where: {
      ...where,
      OR: [
        {
          owner: {
            id: user.id
          }
        },
        {
          users_some: {
            id: user.id
          }
        }
      ]
    },
    ...rest
  })
}

export default {
  type: "OrganizationConnection",
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
