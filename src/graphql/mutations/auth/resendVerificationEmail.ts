import { sendEmail } from '../../../helpers/email'
import endpoint from '../../../helpers/endpoint'
import { stringArg } from '@nexus/schema'

const resolve = async (_, { email }, ctx) => {
  const user = await ctx.prisma.user.findOne({ where: { email }, select: { id: true, emailVerificationCode: true } })
  if(user) {
    await sendEmail([email], 'confirm email', `Go to ${process.env.ENDPOINT}/confirm-email/${user.emailVerificationCode}`)
    return true
  }
  throw new Error('Invalid Email')
  return false
}

export default {
  type: "Boolean",
  args: {
    email: stringArg({ nullable: false })
  },
  resolve
}
