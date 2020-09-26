import authenticate from '../../../helpers/authenticate'
import randomString from '../../../helpers/randomString'

const resolve = async ({ args: { data: args }, ctx, user}: any) => {
  let isCreatorOwner = false
  let isCreatorMember = false
  if(args.organization) {
    const organization = await ctx.prisma.organization.findOne(
      { where: {
        id: args.organization.connect.id
      },
      select: {
        id: true,
        owner: true
      }
    })
    const users = await ctx.prisma.user.findMany({
      where: {
        organizations: {
          some: { id: { equals: organization.id } }
        },
        OR: [
          { id: args.createdBy.connect.id },
          { id: args.assignedTo ? args.assignedTo.connect.id : '' }
        ]
      },
      select: {
        id: true
      }
    })
    isCreatorOwner = organization.owner.id === user.id
    //@ts-ignore
    isCreatorMember = users.find(member => member.id === user.id)
    if(!isCreatorOwner && !isCreatorMember) throw new Error('You are not part of this organization')
  }
  if(user.id !== args.createdBy.connect.id) throw new Error(`You can't create tasks for other users`)
  let code = randomString(4).toLowerCase()
  let taskExists = await ctx.prisma.task.findOne({
    where: {
      code
    }
  })
  while(taskExists) {
    code = randomString(4).toLowerCase()
    taskExists = await ctx.prisma.task.findOne({ code })
  }
  return ctx.prisma.task.create({
    data: {
      ...args, code
    }
  })
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
