import prisma from '../../prisma'
import { compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'

export default async (_, { data: { email, password, staySignedIn } }, ctx, info) => {
  const user = await prisma.query.user({ where: { email } }, '{ id, hash }')
  if(!user) throw new Error('Email Not Found')
  if(!user.hash) throw new Error('No Password Set')
  if(!compareSync(password, user.hash)) throw new Error('Invalid Password')
  const token = sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: staySignedIn ? '1y':'30d' })
  return token
}