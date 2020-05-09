import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data }, ctx, user }) => {
  if(data.owner && data.owner.connect && data.owner.connect.id && data.owner.connect.id !== user.id) {
    throw new Error(`You can't create an organization for other users`)
  }
  return ctx.prisma.createOrganization({
    ...data,
    owner: {
      //@ts-ignore
      connect: { id: user ? user.id : '' }
    }
  })
}

export default {
  type: "Organization",
  args: arg({ type: 'OrganizationCreateInput' }),
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
