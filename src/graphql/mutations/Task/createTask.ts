import authenticate from '../../../helpers/authenticate'
import randomString from '../../../helpers/randomString'

const resolve = async ({ args: { data: args }, ctx, user}: any) => {
  let isCreatorOwner = false
  let isCreatorMember = false
  if(args.organization) {
    const organization = await ctx.prisma.organization(
      { id: args.organization.connect.id }).$fragment(
        `fragment Organization on Organization {
          id
          owner {
            id
          }
          users(where: {
            OR: [
              { id: "${args.createdBy.connect.id}"},
              ${args.assignedTo ?
                `
                { id: "${args.assignedTo.connect.id}"}
                ` :
                '' }
            ]
          }) {
            id
          }
        }`
      )
    isCreatorOwner = organization.owner.id === user.id
    //@ts-ignore
    isCreatorMember = organization.users.find(member => member.id === user.id)
    if(!isCreatorOwner && !isCreatorMember) throw new Error('You are not part of this organization')
  }
  if(user.id !== args.createdBy.connect.id) throw new Error(`You can't create tasks for other users`)
  let code = randomString(4).toLowerCase()
  let taskExists = await ctx.prisma.task({ code })
  while(taskExists) {
    code = randomString(4).toLowerCase()
    taskExists = await ctx.prisma.task({ code })
  }
  return ctx.prisma.createTask({...args, code })
}

export default {
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
