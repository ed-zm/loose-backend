import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async (_, { data }, ctx, info) => {
  const label = await ctx.prisma.label({ text: data.text })
  console.log('-------------------LAAAAAAAAAAABEL', label)
  if(label) {
    return ctx.prisma.updateLabel({
      where: { id: label.id },
      data: {
        tasks: { connect: [ { id: data.tasks.connect[0].id } ] }
      }
    })
  }
  console.log('-----------DATA', data )
  return ctx.prisma.createLabel({ ...data })
}

export default {
  type: "Label",
  args: {
    data: arg({ type: 'LabelCreateInput', required: true })
  },
  nullable: false,
  resolve
}