import { arg } from '@nexus/schema'
import Stripe from 'stripe'
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
          plan: true,
          stripeId: true,
          name: true
        }
      })
      if(organization) {
        const subscriptionType = process.env.STRIPE_STANDARD_SUBSCRIPTION
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        const subscriptionObj = await stripe.subscriptions.create({
          customer: organization.stripeId,
          items: [{
            price: subscriptionType
          }],
          metadata: {
            organization_id: organization.id,
            organization_name: organization.name,
            user_id: currentUser.id,
            first_name: currentUser.firstName,
            last_name: currentUser.lastName,
            email: currentUser.email
          }
        })
        await ctx.prisma.invite.update({
          where,
          data: {
            expireAt: null
          }
        })
        await ctx.prisma.user.update({
          where: { id: currentUser.id },
          data: {
            stripeSubscriptionId: subscriptionObj.id
          }
        })
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
