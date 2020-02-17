import prisma from '../../prisma'
import { hashSync } from 'bcrypt'

export default async (_, { data: { email, password, firstName, lastName, username } }, ctx, info) => {
    const exists = await prisma.exists.User({ email })
    if(exists) throw new Error('Email Already Exists')
    const hash = hashSync(password, 10)
    const user = await prisma.mutation.createUser({ data: {
      email,
      username,
      hash,
      firstName,
      lastName
    }}) 
  if(user) return true
  else return false
}