import { hashSync } from 'bcrypt'
import { stringArg } from 'nexus'

const resolve = async (_, { email, password, firstName, lastName, username }, ctx, info) => {
    const exists = await ctx.prisma.user({ email })
    if(exists) throw new Error('Email Already Exists')
    const hash = hashSync(password, 10)
    const user = await ctx.prisma.createUser({
      email,
      username,
      hash,
      firstName,
      lastName
    }) 
  if(user) return true
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
