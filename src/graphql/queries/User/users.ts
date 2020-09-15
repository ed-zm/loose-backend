import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args, ctx, user }: any) => {
  return ctx.prisma.users({
    ...args,
    where: {
      ...args.where,
      emailVerifiedAt_not: null
    }
  })
}

export default {
  filtering: true,
  ordering: true,
  paginating: true,
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
