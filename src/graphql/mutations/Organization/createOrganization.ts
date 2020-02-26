import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async (_, { data }, ctx, info) => {
  const user = await authenticate(ctx)
  return ctx.prisma.mutation.createOrganization({
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
