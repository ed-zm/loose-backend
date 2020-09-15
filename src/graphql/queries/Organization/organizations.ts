import { arg, intArg, stringArg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where = {}, ...rest }, ctx, user }: any) => {
  return ctx.prisma.organizations({
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
  filtering: true,
  ordering: true,
  paginating: true,
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
