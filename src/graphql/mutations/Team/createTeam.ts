import { arg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data }, ctx, user }: any) => {
  const isOrganizationMember = ctx.prisma.organization.findOne({
    where: {
      OR: [
        {
          owner: {
            id: user.id
          },
          users: {
            some: { id: user.id }
          }
        }
      ]
    },
    select: {
      id: true
    }
  })
  if(!!isOrganizationMember) {
    return ctx.prisma.team.create({
      data: {
        ...data,
        users: {
          connect: [
            { id: user.id }
          ]
        }
      }
    })
  }
  else throw new Error("You are not part of this organization")
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
