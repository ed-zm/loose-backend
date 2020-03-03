import authenticate from '../../../helpers/authenticate'

const resolve = async (_, args, ctx, info) => {
  console.log('Authorization', ctx.request.get('Authorization'))
  const user = await authenticate(ctx)
  console.log(user)
  if(!user) throw new Error('Invalid Token')
  //@ts-ignore
  return ctx.prisma.user({ id: user.id })
}

export default {
  type: "User",
  nullable: true,
  resolve
}
