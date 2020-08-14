import { arg, intArg, stringArg } from 'nexus'
import prisma from '../../../prisma'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where, ...args }, ctx, info, user }) => {
  if(user) {
    const responseRequests = await ctx.prisma.responseRequestsConnection({
      where: {
        ...where,
        assignedTo: {id: user.id }
      },
      ...args
    }, info)
    return responseRequests
  } else {
    return []
  }
}


export default {
  type: "ResponseRequestConnection",
  args: {
    where: arg({ type: 'ResponseRequestWhereInput' }),
    orderBy: arg({ type: 'ResponseRequestOrderByInput' }),
    skip: intArg(),
    after: stringArg(),
    before: stringArg(),
    first: intArg(),
    last: intArg()
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
