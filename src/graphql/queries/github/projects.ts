import axios from 'axios'
import { idArg, stringArg, booleanArg } from 'nexus'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { organizationId, repository }, ctx, user }) => {
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
    `https://api.github.com/orgs/loose_dev/projects?state=all`,
    {
      headers: {
        'Accept': 'application/vnd.github.inertia-preview+json',
        Authorization: `token ${organization.githubToken}`
      }
    }
  )
  if(response && response.status === 200) {
    console.log(response)
    const projects = response.data.map(project => ({
      id: project.id,
      name: project.name,
      number: project.number,
      updatedAt: project.updated_at,
      createdAt: project.created_at,
      url: project.url,
      body: project.body,
    }))
    return projects
  } else {
    throw new Error("An Error Ocurring fetching Projects")
  }
}

export default {
  type: "GithubProject",
  list: true,
  args: {
    organizationId: idArg({ nullable: false }),
    isOrganization: booleanArg({ nullable: true }),
    username: stringArg({ nullable: true })
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
