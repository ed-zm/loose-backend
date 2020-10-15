import Stripe from 'stripe'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data }, ctx, user }: any) => {
  if(data.owner && data.owner.connect && data.owner.connect.id && data.owner.connect.id !== user.id) {
    throw new Error(`You can't create an organization for other users`)
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const customer = await stripe.customers.create({
    name: data.name,
    source: data.stripeId
  })
  if(!customer) throw new Error('Cannot create an Organization')
  return ctx.prisma.organization.create({
    data: {
      ...data,
      stripeId: customer.id,
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
