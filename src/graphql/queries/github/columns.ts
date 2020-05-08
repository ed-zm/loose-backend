import axios from 'axios'
import { idArg, stringArg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async (_, { organizationId, projectId }, ctx, info) => {
  const user = await authenticate(ctx)
  if(!user) throw new Error('Invalid Token')
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
    `https://api.github.com/projects/${projectId}/columns`,
    {
      headers: {
        Accept: 'application/vnd.github.inertia-preview+json',
        Authorization: `token ${organization.githubToken}`
      }
    }
  )
  if(response && response.status === 200) {
    const projects = response.data.map(project => ({
      id: project.id,
      updatedAt: project.updated_at,
      createdAt: project.created_at
    }))
    return projects
  } else {
    throw new Error("An Error Ocurring fetching Columns")
  }
}

export default {
  type: "GithubColumn",
  list: true,
  args: {
    organizationId: idArg({ nullable: false }),
    projectId: stringArg({ nullable: false })
  },
  nullable: false,
  resolve
}
