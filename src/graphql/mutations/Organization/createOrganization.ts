import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data }, ctx, user }: any) => {
  if(data.owner && data.owner.connect && data.owner.connect.id && data.owner.connect.id !== user.id) {
    throw new Error(`You can't create an organization for other users`)
  }

  return ctx.prisma.organization.create({
    data: {
      ...data,
      owner: {
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
