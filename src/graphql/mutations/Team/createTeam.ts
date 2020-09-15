import { arg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data }, ctx, user }: any) => {
  const isOrganizationMember = ctx.prisma.$exists.organization({
    OR: [
      {
        owner: {
          id: user.id
        },
        users_some: {
          id: user.id
        }
      }
    ]
  })
  if(isOrganizationMember) {
    return ctx.prisma.createTeam({
      ...data,
      users: {
        connect: [
          { id: user.id }
        ]
      }
    })
  }
  else throw new Error("You are not part of this organization")
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
