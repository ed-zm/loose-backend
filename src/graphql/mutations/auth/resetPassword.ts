import uid from 'uid'
import { stringArg } from 'nexus'
import { sendEmail } from '../../../helpers/email'
import endpoint from '../../../helpers/endpoint'

const resolve = async (_, { email }, ctx) => {
  const user = await ctx.prisma.user({ email }, '{ id }')
  if(user) {
    const resetPasswordCode = uid(10)
    const updatedUser = await ctx.prisma.updateUser({where: { email }, data: { resetPasswordCode, resetPasswordCodeIssuedAt: new Date() } }, `{ id, resetPasswordCode }`)
    if(updatedUser && updatedUser.resetPasswordCode) {
      //@ts-ignore
      const ses = await sendEmail([email], 'Reset Password', `Go to ${endpoint()}/confirm-reset-password/${resetPasswordCode} to reset your password`)
      if(ses.sent && !ses.error) {
        return true
      } else {
        throw new Error('We could not reset your password')
      }
    } else {
      throw new Error('We could not reset your password')
    }
  } else {
    throw new Error('Invalid Email')
  }
}

export default {
  type: "Boolean",
  args: {
    email: stringArg({ nullable: false })
  },
  nullable: false,
  resolve
}
