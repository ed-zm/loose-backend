import jwt from 'jsonwebtoken'

export default async ({ args, resolve, ctx })=> {
  let user = null
  const token = await ctx.request.get('Authorization')
  await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err) {
      return
    } else {
      user = decoded
    }
  })
  if(!user) throw new Error('Unauthenticated')
  return await resolve({ args, ctx, user })
}
