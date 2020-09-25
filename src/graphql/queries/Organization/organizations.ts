import { arg, intArg, stringArg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where = {}, first: take, after: cursor, ...rest }, ctx, user }: any) => {
  return ctx.prisma.organization.findMany({
    where: {
      ...where,
      OR: [
        {
          owner: {
            id: user.id
          }
        },
        {
          users: {
            some: { id: user.id }
          }
        }
      ]
    },
    cursor,
    take,
    skip: (!!cursor && !!cursor.id) ? 1 : 0,
    ...rest
  })
}

export default {
  filtering: true,
  ordering: true,
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
