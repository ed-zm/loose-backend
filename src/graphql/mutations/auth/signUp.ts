import { hashSync } from 'bcrypt'
import moment from 'moment'
import { sign } from 'jsonwebtoken'
import { stringArg } from '@nexus/schema'
import { sendEmail } from '../../../helpers/email'
import endpoint from '../../../helpers/endpoint'
import uid from 'uid'

const resolve = async (_, { email, password, firstName, lastName, username, inviteCode }, ctx) => {
    const exists = await ctx.prisma.$exists.user({ email })
    if(exists) throw new Error('Email Already Exists')
    const isInvited = await ctx.prisma.$exists.invite({
      code: inviteCode,
      email
    })
    const emailVerificationCode = uid(16)
    const hash = hashSync(password, 10)
    const user = await ctx.prisma.createUser({
      email,
      username,
      hash,
      firstName,
      lastName,
      emailVerifiedAt: isInvited ? moment() : null,
      emailVerificationCode,
      emailVerificationCodeIssuedAt: moment()
    })
  if(user) {
    await sendEmail([email], 'confirm email', `Go to ${process.env.ENDPOINT}/confirm-email/${emailVerificationCode}`)
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
