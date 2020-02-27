import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async (_, { data }, ctx, info) => {
  const user = await authenticate(ctx)
  if(!user) throw new Error('Not Logged In')
  if(data.owner && data.owner.connect && data.owner.connect.id && data.owner.connect.id !== user.id) {
    throw new Error(`You can't create an organization for other users`)
  }
  return ctx.prisma.createOrganization({
    ...data,
    owner: {
      //@ts-ignore
      connect: { id: user ? user.id : '' }
    }
  }, info)
}

export default {
  type: "Organization",
  args: arg({ type: 'OrganizationCreateInput' }),
  nullable: false,
  resolve
}
