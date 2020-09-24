import axios from 'axios'
import { idArg, stringArg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { organizationId, columnId }, ctx, user }) => {
  const organizations = await ctx.prisma.organization.findMany({
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
        'Accept': 'application/vnd.github.inertia-preview+json',
        Authorization: `token ${organization.githubToken}`
      }
    }
  )
  if(response && response.status === 200) {
    const projects = response.data.map(project => ({
      id: project.id,
      note: project.note,
      archived: project.archived,
      updatedAt: project.updated_at,
      createdAt: project.created_at
    }))
    return projects
  } else {
    throw new Error("An Error Ocurring fetching Cards")
  }
}

export default {
  type: "GithubCard",
  list: true,
  args: {
    organizationId: idArg({ nullable: false }),
    columnId: idArg({ nullable: false })
  },
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
