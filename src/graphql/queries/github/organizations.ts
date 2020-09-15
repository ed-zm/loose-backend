import axios from 'axios'
import { idArg } from '@nexus/schema'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { organizationId }, ctx, user }) => {
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
    'https://api.github.com/user/orgs',
    {
      headers: {
        Authorization: `token ${organization.githubToken}`
      }
    }
  )
  if(response && response.status === 200) {
    const organizations = response.data.map(org => ({
      id: org.id,
      login: org.login,
      description: org.description
    }))
    return organizations
  } else {
    throw new Error("An Error Ocurring fetching Repos")
  }
}

export default {
  type: "GithubOrganization",
  list: true,
  args: {
    organizationId: idArg({ nullable: false }),
    // organization: stringArg({ nullable: false })
  },
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
