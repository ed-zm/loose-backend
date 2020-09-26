import { stringArg } from '@nexus/schema'
import moment from 'moment'

const resolve = async (_, { emailVerificationCode, password }, ctx) => {
  const user = await ctx.prisma.user.findMany({
    where: {
      emailVerificationCode
    },
    select: {
      id: true,
      email: true,
      emailVerificationCodeIssuedAt: true
    }
  },)
  if(user && !!user.length && user.length === 1) {
    const updatedUser = await ctx.prisma.user.update({
      where: {
        id: user[0].id
      },
      data: {
        emailVerifiedAt: moment().toISOString(),
        emailVerificationCode: null,
        emailVerificationCodeIssuedAt: null,
      }
    })
    if(!!updatedUser) return true
    else return false
  } else {
    throw new Error('Invalid Code')
  }
}

export default {
  type: "Boolean",
  args: {
    emailVerificationCode: stringArg({ nullable: false })
  },
  nullable: false,
  resolve
}
