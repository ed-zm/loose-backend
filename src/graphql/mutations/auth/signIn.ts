import { compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { stringArg, booleanArg } from 'nexus'

const resolve = async (_, { email, password, staySignedIn }, ctx, info) => {
  const user = await ctx.prisma.user({ email }, '{ id, hash, emailVerifiedAt }')
  if(!user) throw new Error('Email Not Found')
  if(!user.hash) throw new Error('No Password Set')
  if(!user.emailVerifiedAt) throw new Error('You have to confirm your Email')
  if(!compareSync(password, user.hash)) throw new Error('Invalid Password')
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