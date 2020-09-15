import { arg, intArg, stringArg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args, ctx, user }: any) => {
  return ctx.prisma.comments(args)
}

export default {
  filtering: true,
  ordering: true,
  paginating: true,
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
