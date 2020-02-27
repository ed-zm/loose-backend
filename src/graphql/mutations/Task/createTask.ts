import { arg, stringArg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async (_, args, ctx, info) => {
  const user = await authenticate(ctx)
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

  let isCreatorOwner = false
  let isCreatorMember = false
  if(organization) {
    isCreatorOwner = organization.owner.id === user.id
    isCreatorMember = organization.users.find(member => member.id === user.id)
  } else {
    throw new Error('Invalid Organization')
  }
  if(!isCreatorOwner && !isCreatorMember) throw new Error(`You don't belong to Organization`)
  if(user.id !== args.createdBy.id) throw new Error(`You can't create tasks for other users`)
  return ctx.prisma.createTask(args)
}

export default {
  type: "Task",
  args: arg({ type: 'TaskCreateInput' }),
  nullable: false,
  resolve
}
