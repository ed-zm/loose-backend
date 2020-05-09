import axios from 'axios'
import { idArg } from 'nexus'
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
    'https://api.github.com/user/repos',
    {
      headers: {
        Authorization: `token ${organization.githubToken}`
      }
    }
  )
  if(response && response.status === 200) {
    const repositories = response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
      updatedAt: repo.updated_at,
      language: repo.language,
      openIssuesCount: repo.open_issues_count,
      description: repo.description,
      stargazersCount: repo.stargazers_count,
      forksCount: repo.forks_count
    }))
    return repositories
  } else {
    throw new Error("An Error Ocurring fetching Repos")
  }
}

export default {
  type: "GithubRepository",
  list: true,
  args: {
    organizationId: idArg({ nullable: false }),
    // organization: stringArg({ nullable: false })
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
