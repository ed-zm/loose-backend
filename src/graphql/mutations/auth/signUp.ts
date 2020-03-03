import { hashSync } from 'bcrypt'
import moment from 'moment'
import { stringArg } from 'nexus'
import { sendEmail } from '../../../helpers/email'
import uid from 'uid'

const resolve = async (_, { email, password, firstName, lastName, username }, ctx) => {
    const exists = await ctx.prisma.user({ email })
    if(exists) throw new Error('Email Already Exists')
    const emailVerificationCode = uid(16)
    const hash = hashSync(password, 10)
    const user = await ctx.prisma.createUser({
      email,
      username,
      hash,
      firstName,
      lastName,
      emailVerificationCode,
      emailVerificationCodeIssuedAt: moment()
    }) 
  if(user) {
    await sendEmail([email], 'confirm email', `Go to http://localhost:3000/confirm-email/${emailVerificationCode}`)
    return true
  }
  else return false
}

export default {
  type: "Boolean",
  args: {
    email: stringArg({ nullable: false }),
    password: stringArg({ nullable: false }),
    firstName: stringArg({ nullable: false }),
    lastName: stringArg({ nullable: true }),
    username: stringArg({ nullable: false })
  },
  nullable: false,
  resolve
}
