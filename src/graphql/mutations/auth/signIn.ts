import { compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { stringArg, booleanArg } from 'nexus'
import errors from 'loose-components/src/utils/errors'

const resolve = async (_, { email, password, staySignedIn }, ctx, info) => {
  const user = await ctx.prisma.user({ email }, '{ id, hash, emailVerifiedAt }')
  if(!user) throw new Error(errors.EMAIL_NOT_FOUND)
  if(!user.hash) throw new Error(errors.NO_PASSWORD)
  if(!user.emailVerifiedAt) throw new Error(errors.CONFIRM_EMAIL)
  if(!compareSync(password, user.hash)) throw new Error(error.INVALID_PASSWORD)
  const token = sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: staySignedIn ? '1y':'30d' })
  return token
}

export default {
  type: "String",
  args: {
    email: stringArg({ nullable: false }),
    password: stringArg({ nullable: false }),
    staySignedIn: booleanArg({ nullable: true })
  },
  nullable: false,
  resolve
}
