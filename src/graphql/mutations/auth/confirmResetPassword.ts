import { stringArg } from 'nexus'
import { hashSync } from 'bcrypt'

const resolve = async (_, { resetPasswordCode, password }, ctx) => {
  const user = await ctx.prisma.users({ where: {
    resetPasswordCode
  } }, '{ id, email, resetPasswordCode, resetPasswordCodeIssuedAt }')
  if(user && !!user.length && user.length === 1) {
    const hash = hashSync(password, 10)
    const updatedUser = await ctx.prisma.updateUser({
      where: {
        id: user[0].id
      },
      data: {
        hash,
        resetPasswordCode: null,
        resetPasswordCodeIssuedAt: null
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
    resetPasswordCode: stringArg({ nullable: false }),
    password: stringArg({ nullable: false })
  },
  nullable: false,
  resolve
}