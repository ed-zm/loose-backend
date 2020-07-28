import { arg, intArg, stringArg } from 'nexus'
import prisma from '../../../prisma'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where, ...args }, ctx, info, user }) => {
  if(user) {
    // const organizationWhere = {
    //   OR: [
    //     { owner: { id: user.id } },
    //     { users_some: { id: user.id }}
    //   ]
    // }
    // const organizations = await prisma.organizations({ where: organizationWhere }, `{ id }`)
    // //@ts-ignore
    // const organizationIds = organizations.map(organization => organization.id) || []
    // const tasks = await prisma.tasks({where: { ...where, organization: { id_in: organizationIds }}, ...args })
    const tasks = await ctx.prisma.tasksConnection({
      where: {
        ...where,
        OR: [
          { createdBy: { id: user.id } },
          { assignedTo: {id: user.id } }
        ]
      },
      ...args
    }, info)
    return tasks
  } else {
    return []
  }
}


export default {
  type: "TaskConnection",
  args: {
    where: arg({ type: 'TaskWhereInput' }),
    orderBy: arg({ type: 'TaskOrderByInput' }),
    skip: intArg(),
    after: stringArg(),
    before: stringArg(),
    first: intArg(),
    last: intArg()
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
