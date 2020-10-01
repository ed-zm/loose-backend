import { hashSync } from 'bcrypt'
import Stripe from 'stripe'
import moment from 'moment'
import { sign } from 'jsonwebtoken'
import { stringArg } from '@nexus/schema'
import { sendEmail } from '../../../helpers/email'
import uid from 'uid'

const resolve = async (_: any, { email, password, firstName, lastName, username, inviteCode, stripeToken, subscription }: any, ctx: any) => {
    const exists = await ctx.prisma.user.findOne({
      where: {
        email
      }
    })
    if(!!exists) throw new Error('Email Already Exists')
    const invited = await ctx.prisma.invite.findMany({
      where: {
        code: inviteCode,
        email
      }
    })
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const subscriptionType = process.env.STRIPE_STANDARD_SUBSCRIPTION
    const customer = await stripe.customers.create({
      email,
      source: stripeToken
    })
    const subscriptionObj = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: subscriptionType
      }]
    })
    console.log('DOWN', subscription)
    const isInvited = invited && !!invited.length
    const emailVerificationCode = uid(16)
    const hash = hashSync(password, 10)
    console.log('CREATE', customer.id, subscriptionObj.id)
    const user = await ctx.prisma.user.create({
      data: {
        email,
        stripeId: customer.id,
        stripeSubscriptionId: subscriptionObj.id,
        username,
        hash,
        firstName,
        lastName,
        emailVerifiedAt: true ? moment().toISOString() : null,
        emailVerificationCode,
        emailVerificationCodeIssuedAt: moment().toISOString()
      }
    })
  if(user) {
    await sendEmail([email], 'confirm email', `Go to ${process.env.ENDPOINT}/confirm-email/${emailVerificationCode}`)
    //@ts-ignore
    return isInvited ? sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d'}) : 'created'
  }
  else return ''
}

export default {
  type: "String",
  args: {
    email: stringArg({ nullable: false }),
    password: stringArg({ nullable: false }),
    firstName: stringArg({ nullable: false }),
    lastName: stringArg({ nullable: true }),
    username: stringArg({ nullable: false }),
    inviteCode: stringArg({ nullable: true }),
    stripeToken: stringArg({ nullable: false }),
    subscription: stringArg({ nullable: false })
  },
  nullable: false,
  resolve
}
