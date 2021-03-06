import axios from 'axios'
import { idArg, stringArg, booleanArg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { organizationId, repository }, ctx, user }) => {
  const organizations = await ctx.prisma.organization.findMany({
    where: {
      id: organizationId,
      owner: {
        id: user ? user.id : ''
      }
    }})
  const organization = organizations.length ? organizations[0] : null
  if(!organization) throw new Error("Invalid Organization")
  if(!organization.githubOrganization) throw new Error("There is not a linked Organization")
  const response = await axios.get(
    `https://api.github.com/orgs/${organization.githubOrganization}/projects`,
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
      name: project.name,
      number: project.number,
      updatedAt: new Date(project.updated_at),
      createdAt: new Date(project.created_at),
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
    organizationId: idArg({ nullable: false })
  },
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
