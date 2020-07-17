import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where }, ctx, user }) => {
  const isOwner = await ctx.prisma.$exists.organization({
    owner: {
      id: user.id
    }
  })
  if(isOwner) return ctx.prisma.deleteOrganization(where)
  else throw new Error("You are not the organization owner");
}

export default {
  type: "Organization",
  args: {
    where: arg({ type: 'OrganizationWhereUniqueInput'})
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
