import { arg } from 'nexus'
import authenticate from '../../../helpers/authenticate'
import randomString from '../../../helpers/randomString'

const resolve = async (_, { data: args }, ctx, info) => {
  const user = await authenticate(ctx)
  let isCreatorOwner = false
  let isCreatorMember = false
  if(args.organization) {
    const organization = await ctx.prisma.organization(
      { id: args.organization.connect.id },
      `{
        id
        owner {
          id
        }
        users(where: {
          OR: [
            { id: ${args.createdBy.id}},
            ${args.assignedTo ?
              `
              { id: ${args.assignedTo.id}}
              ` :
              '' }
          ]
        }) {
          id
        }
      }`)
    isCreatorOwner = organization.owner.id === user.id
    isCreatorMember = organization.users.find(member => member.id === user.id)
    if(!isCreatorOwner && !isCreatorMember) throw new Error('You are not part of this organization')
  }
  if(user.id !== args.createdBy.connect.id) throw new Error(`You can't create tasks for other users`)
  let code = randomString(4)
  let taskExists = await ctx.prisma.task({ code })
  while(taskExists) {
    code = randomString(4)
    taskExists = await ctx.prisma.task({ code })
  }
  return ctx.prisma.createTask({...args, code })
}

export default {
  type: "Task",
  args: { 
    data: arg({ type: 'TaskCreateInput', required: true })
  },
  nullable: false,
  resolve
}
