import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }) => {
  const isOwner = await ctx.prisma.$exists.organization({
    owner: {
      id: user.id
    }
  })
  if(isOwner) return ctx.prisma.updateOrganization({ data, where })
  else throw new Error("You are not the organization owner");
}

export default {
  type: "Organization",
  args: {
    data: arg({ type: 'OrganizationUpdateInput' }),
    where: arg({ type: 'OrganizationWhereUniqueInput'})
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
