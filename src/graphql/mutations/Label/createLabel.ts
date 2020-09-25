import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { data }, ctx, user }: any) => {
  const label = await ctx.prisma.label({ where: { text: data.text } })
  if(!!label) {
    return ctx.prisma.label.update({
      where: { id: label.id },
      data: {
        tasks: { connect: [ { id: data.tasks.connect[0].id } ] }
      }
    })
  }
  return ctx.prisma.label.create({ data })
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
