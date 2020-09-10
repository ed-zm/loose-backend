import { arg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data }, ctx, user }) => {
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
  type: "Team",
  args: {
    data: arg({ type: 'TeamCreateInput' })
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
