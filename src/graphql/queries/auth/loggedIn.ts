import authenticate from '../../../helpers/authenticate'

const resolve = async ({ user, args, ctx }) => {
  if(!user) throw new Error('Invalid Token')
  //@ts-ignore
  return ctx.prisma.user({ id: user.id })
}

export default {
  type: "User",
  nullable: true,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
