import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where, first, after: cursor, ...args }, ctx, user }: any) => {
  if(user) {
    const responseRequests = await ctx.prisma.responseRequest.findMany({
      where: {
        ...where,
        assignedTo: {id: user.id }
      },
      take: first,
      cursor,
      skip: (!!cursor && !!cursor.id) ? 1 : 0,
      ...args
    })
    return responseRequests
  } else {
    return []
  }
}


export default {
  filtering: true,
  ordering: true,
  paginating: true,
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
