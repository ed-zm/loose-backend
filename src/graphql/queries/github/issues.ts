import axios from 'axios'
import { idArg, stringArg } from 'nexus'
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
    `https://api.github.com/repos/${repository}/issues`,
    {
      headers: {
        Authorization: `token ${organization.githubToken}`
      }
    }
  )
  if(response && response.status === 200) {
    const issues = response.data.map(issue => ({
      id: issue.id,
      title: issue.title,
      state: issue.state,
      number: issue.number,
      updatedAt: issue.updated_at,
      createdAt: issue.created_at,
      closedAt: issue.closed_at,
      url: issue.url,
      body: issue.body,
      comments: issue.comments
    }))
    return issues
  } else {
    throw new Error("An Error Ocurring fetching Issues")
  }
}

export default {
  type: "GithubIssue",
  list: true,
  args: {
    organizationId: idArg({ nullable: false }),
    repository: stringArg({ nullable: false })
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
