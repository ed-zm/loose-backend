import { arg } from '@nexus/schema'
import moment from 'moment'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where }, ctx, user }: any) => {
  const currentUser = await ctx.prisma.user.findOne({ where: { id: user.id } })
  const exists = await ctx.prisma.invite.findMany({
    where: {
      code: { equals: where.code },
      expireAt: { gt: moment().toISOString() },
      OR: [
        {
          to: {
            id: { equals: currentUser.id }
          }
        },
        {
          email: { equals: currentUser.email }
        }
      ]
    },
    select: {
      id: true
    }
  })
  if(!!exists.length) {
    const invite = await ctx.prisma.invite.findOne({
      where,
      select: {
        id: true,
        type: true,
        typeId: true
      }
    })
    if(invite.type === 'ORGANIZATION') {
      const organization = await ctx.prisma.organization.update({
        where: {
          id: invite.typeId
        },
        data: {
          users: {
            connect: [
              { id: user.id }
            ]
          }
        },
        select: {
          id: true,
          name: true
        }
      })
      await ctx.prisma.invite.update({
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
  type: 'String',
  args: {
    where: arg({ type: 'InviteWhereUniqueInput' })
  },
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
