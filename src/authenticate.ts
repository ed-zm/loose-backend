import jwt from 'jsonwebtoken'

export default async ctx => {
  let isValid = false
  const token = ctx.request.get('Authorization')
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err) {
      return
    } else {
      isValid = true
    }
  })
  return isValid
}