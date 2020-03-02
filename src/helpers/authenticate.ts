import jwt from 'jsonwebtoken'

export default async ctx => {
  let user = null
  const token = ctx.request.get('Authorization')
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err) {
      return
    } else {
      user = decoded
    }
  })
  if(!user) throw new Error('Unauthenticated')
  return user
}