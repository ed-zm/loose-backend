import { arg, intArg, stringArg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { where, first: take, after: cursor, ...args }, ctx, user }: any) => {
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
    const tasks = await ctx.prisma.task.findMany({
      where: {
        ...where,
        OR: [
          { createdBy: { id: user.id } },
          { assignedTo: {id: user.id } }
        ]
      },
      cursor,
      take,
      skip: (!!cursor && !!cursor.id) ? 1 : 0,
      ...args
    })
    return tasks
  } else {
    return []
  }
}


export default {
  nullable: false,
  filtering: true,
  ordering: true,
  paginating: true,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
