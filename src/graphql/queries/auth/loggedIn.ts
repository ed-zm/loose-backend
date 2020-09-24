import authenticate from '../../../helpers/authenticate'

const resolve = async ({ user, args, ctx }: any) => {
  if(!user) throw new Error('Invalid Token')

  return ctx.prisma.user.findOne({
    where: {
      id: user.id
    }
  })
}

export default {
  type: "User",
  nullable: true,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
