import publicResolvers from './publicResolvers'
import authenticate from './authenticate'

export default async (key, ctx, callback) => {
  const isPublic = publicResolvers.find(p => p ===  key)
  if(isPublic) {
    return callback()
  } else {
    const authenticated = await authenticate(ctx)
    if(authenticated) {
      return callback()
    } else {
      throw new Error("Unauthenticated")
    }
  }
}
