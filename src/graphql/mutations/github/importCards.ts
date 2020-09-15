import axios from 'axios'
import { idArg, stringArg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'
import randomString from '../../../helpers/randomString'

const resolve = async ({ args: { organizationId, columnId, projectId }, ctx, user }) => {
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
    `https://api.github.com/projects/columns/${columnId}/cards`,
    {
      headers: {
        Accept: 'application/vnd.github.inertia-preview+json',
        Authorization: `token ${organization.githubToken}`
      }
    }
  )
  if(response && response.status === 200) {
    const cardsIds = response.data.map(card => `card-${card.id}`)
    const tasksCreated = await ctx.prisma.tasks({
      where: {
        id_in: cardsIds
      }
    })
    const cards = await Promise.all(response.data.map(async card => {
      const exists = tasksCreated.find(task => task.id === `card-${card.id}`)
      if(exists) return null
      if(card.content_url) {
        const issuesResponse = await axios.get(
          card.content_url,
          {
            headers: {
              Authorization: `token ${organization.githubToken}`
            }
          }
        )
        if(issuesResponse && issuesResponse.status === 200) {
          return ({
            id: `card-${card.id.toString()}`,
            title: issuesResponse.data.title,
            state: issuesResponse.data.state === 'open' ? 0 : 1,
            body: issuesResponse.data.body
          })
        } else {
          return null
        }
      } else {
        return ({
          id: `card-${card.id.toString()}`,
          title: card.note,
          state: 0,
          body: ''
        })
      }
    }))
    const cardsToCreate = cards.filter(card => {
      if(!card) return false
      return !tasksCreated.find(task => task.id === card.id)
    })
    const promises = await Promise.all(
      cardsToCreate.map(card => {
        return ctx.prisma.createTask({
          id: card.id,
          title: card.title,
          state: card.state === 'open' ? 0 : 1,
          description: card.body,
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
    throw new Error("An Error Ocurring importing cards")
  }
}

export default {
  type: "Task",
  list: true,
  args: {
    organizationId: idArg({ nullable: false }),
    columnId: stringArg({ nullable: false }),
    projectId: stringArg({ nullable: false })
  },
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
