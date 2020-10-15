import { hashSync } from 'bcrypt'
import moment from 'moment'
import { sign } from 'jsonwebtoken'
import { stringArg } from '@nexus/schema'
import { sendEmail } from '../../../helpers/email'
import uid from 'uid'

const resolve = async (_: any, { email, password, firstName, lastName, username, inviteCode }: any, ctx: any) => {
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

    // const subscriptionType = process.env.STRIPE_STANDARD_SUBSCRIPTION
    // const subscriptionObj = await stripe.subscriptions.create({
    //   customer: customer.id,
    //   items: [{
    //     price: subscriptionType
    //   }]
    // })
    const isInvited = invited && !!invited.length
    const emailVerificationCode = uid(16)
    const hash = hashSync(password, 10)
    const user = await ctx.prisma.user.create({
      data: {
        email,
        // stripeId: customer.id,
        // stripeSubscriptionId: subscriptionObj.id,
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
    inviteCode: stringArg({ nullable: true })
  },
  nullable: false,
  resolve
}
