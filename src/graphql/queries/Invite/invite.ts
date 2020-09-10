import { arg } from '@nexus/schema'
import moment from 'moment'
import prisma from '../../../prisma'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where }, ctx, user }) => {
  const currentUser = await ctx.prisma.user({ id: user.id })
  const exists = await ctx.prisma.$exists.invite({
    code: where.code,
    expireAt_gt: moment(),
    OR: [
      {
        to: {
          id: currentUser.id
        }
      },
      {
        email: currentUser.email
      }
    ]
  })
  if(exists) {
    const invite = await ctx.prisma.invite(where, '{ id, type, typeId }')
    if(invite.type === 'ORGANIZATION') {
      const organization = await ctx.prisma.updateOrganization({
        where: {
          id: invite.typeId
        },
        data: {
          users: {
            connect: [
              { id: user.id }
            ]
          }
        }
      }, '{ id, name }')
      await ctx.prisma.updateInvite({
        where,
        data: {
          expireAt: null
        }
      })
      if(organization) {
        return(`/${invite.type.toLowerCase()}/${organization.id}`)
      } else {
        throw new Error('You cannot join the organization')
      }
    } else {
      throw new Error('Wrong Type')
    }
  }
  throw new Error('Invite does not exist')
}


export default {
  type: "String",
  args: {
    where: arg({ type: 'InviteWhereUniqueInput' })
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
