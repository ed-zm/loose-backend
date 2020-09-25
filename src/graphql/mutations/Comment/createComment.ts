import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data }, ctx, user }: any) => {
  if(data.user && data.user.connect && data.user.connect.id && data.user.connect.id !== user.id) {
    throw new Error(`You can't create a comment for other users`)
  }
  return ctx.prisma.comment.create({
    data: {
      ...data,
      user: {
        //@ts-ignore
        connect: { id: user ? user.id : '' }
      }
    }
  })
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
