import { arg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data, where }, ctx, user }) => {
  const isCreator = await ctx.prisma.$exists.task({
    createdBy: {
      id: user.id
    }
  })
  if(isCreator) return ctx.prisma.updateLabel({ data, where })
  else throw new Error("You are not the task creator");
}

export default {
  type: "Label",
  args: {
    data: arg({ type: 'LabelUpdateInput' }),
    where: arg({ type: 'LabelWhereUniqueInput'})
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
