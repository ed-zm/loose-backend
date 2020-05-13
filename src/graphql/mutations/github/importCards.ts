import axios from 'axios'
import { idArg, stringArg } from 'nexus'
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
    const cards = response.data.map(card => ({
      id: card.id.toString(),
      title: card.node_id,
      state: 0,
      body: card.node_id
    }))
    const cardsIds = cards.map(card => card.id)
    const tasksCreated = await ctx.prisma.tasks({
      where: {
        id_in: cardsIds
      }
    })
    const cardsToCreate = cards.filter(card => !tasksCreated.find(task => task.id === card.id))
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
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
