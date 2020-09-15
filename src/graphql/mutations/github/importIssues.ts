import axios from 'axios'
import { idArg, stringArg, booleanArg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'
import randomString from '../../../helpers/randomString'

const resolve = async ({ args: { organizationId, repository, open }, ctx, user }) => {
  const organizations = await ctx.prisma.organizations({
    where: {
      id: organizationId,
      owner: {
        id: user ? user.id : ''
      }
    }})
  const organization = organizations.length ? organizations[0] : null
  if(!organization) throw new Error("Invalid Organization")
  const response = await axios.get(
    `https://api.github.com/repos/${repository}/issues?state=${open ? 'open' : 'all'}`,
    {
      headers: {
        Authorization: `token ${organization.githubToken}`
      }
    }
  )
  if(response && response.status === 200) {
    const issues = response.data.map(issue => ({
      id: `issue-${issue.id.toString()}`,
      title: issue.title,
      state: issue.state,
      body: issue.body
    }))
    const issuesIds = issues.map(issue => issue.id)
    const tasksCreated = await ctx.prisma.tasks({
      where: {
        id_in: issuesIds
      }
    })
    const issuesToCreate = issues.filter(issue => !tasksCreated.find(task => task.id === issue.id))
    const promises = await Promise.all(
      issuesToCreate.map(issue => {
        return ctx.prisma.createTask({
          id: issue.id,
          title: issue.title,
          state: issue.state === 'open' ? 0 : 1,
          description: issue.body,
          code: randomString(4).toLowerCase(),
          createdBy: {
            connect: {
              id: user.id
            }
          }
        })
      })
    )
    const newTasks = promises.filter(promise => promise)
    return newTasks
  } else {
    throw new Error("An Error Ocurring fetching Issues")
  }
}

export default {
  type: "Task",
  list: true,
  args: {
    organizationId: idArg({ nullable: false }),
    repository: stringArg({ nullable: false }),
    open: booleanArg({ nullable: true })
  },
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
