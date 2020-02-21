import prisma from '../../../prisma'
import authenticate from '../../../helpers/authenticate'

export default async (_, { where, ...args }, ctx, info) => {
  const user: any = await authenticate(ctx)
  if(user) {
    const organizationWhere = {
      OR: [
        { owner: { id: user.id } },
        { users_some: { id: user.id }}
      ]
    } 
    const organizations = await prisma.query.organizations({ where: organizationWhere }, `{ id }`)
    //@ts-ignore
    const organizationIds = organizations.map(organization => organization.id) || []
    const tasks = await prisma.query.tasks({where: { ...where, organization: { id_in: organizationIds }}, ...args })
    console.log('TASKS', tasks)
    return tasks
  } else {
    return []
  }
}