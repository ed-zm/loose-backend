import axios from 'axios'
import { stringArg, booleanArg, idArg } from 'nexus'

const resolve = async (_, { organizationId, code }, ctx, info) => {
  const response = await axios.post('https://github.com/login/oauth/access_token', {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code
  })
  if(response && response.data && response.status === 200) {
    const [ _, rawToken ] = response.data.split('=')
    const [ token ] = rawToken.split('&')
    await ctx.prisma.updateOrganization({ where: { id: organizationId }, data: { githubToken: token }})
    return token
  }
  throw new Error("Error Github")
}

export default {
  type: "String",
  args: {
    organizationId: idArg({ nullable: false }),
    code: stringArg({ nullable: false })
  },
  nullable: false,
  resolve
}
