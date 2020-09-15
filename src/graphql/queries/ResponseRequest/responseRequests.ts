import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where, ...args }, ctx, user }: any) => {
  if(user) {
    const responseRequests = await ctx.prisma.responseRequests({
      where: {
        ...where,
        assignedTo: {id: user.id }
      },
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
