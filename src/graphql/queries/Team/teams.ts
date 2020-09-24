import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { first: take, after: cursor, ...args }, ctx, user }: any) => {
  return ctx.prisma.team.findMany({
    ...args,
    take,
    cursor,
    skip: (!!cursor && !!cursor.id) ? 1 : 0,
  })
}

export default {
  filtering: true,
  ordering: true,
  paginating: true,
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
