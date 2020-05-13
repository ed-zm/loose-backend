import { prismaObjectType } from "nexus-prisma";
import getS3SignedUrl from './aws/getS3SignedUrl'
import organizations from './Organization/organizations'
import loggedIn from './auth/loggedIn'
import tasks from './Task/tasks'
import githubCards from './github/cards'
import githubColumns from './github/columns'
import githubOrganizations from './github/organizations'
import githubProjects from './github/projects'
import githubRepositories from './github/repositories'
import githubIssues from './github/issues'


// Use "*" to use all fields
export default prismaObjectType({
  name: "Query",
  definition(t) {
    t.prismaFields([
      "comments",
      "labels",
      "organization",
      "task",
      "team",
      "teams",
      "user",
      "users"
    ]);
    //@ts-ignore
    t.field("getS3SignedUrl", getS3SignedUrl)
    //@ts-ignore
    t.field("loggedIn", loggedIn)
    //@ts-ignore
    t.field('organizations', organizations)
    //@ts-ignore
    t.field('githubCards', githubCards)
    //@ts-ignore
    t.field('githubColumns', githubColumns)
    //@ts-ignore
    t.field('githubOrganizations', githubOrganizations)
    //@ts-ignore
    t.field('githubProjects', githubProjects)
    //@ts-ignore
    t.field('githubRepositories', githubRepositories)
    //@ts-ignore
    t.field('githubIssues', githubIssues)
    //@ts-ignore
    t.field('tasks', tasks)
  }
})
// import prisma from '../../prisma'
// import createResolver from '../../helpers/createResolver'
// import tasks from './Task/tasks'

// let Query = {}
// const queryResolvers = [...Object.keys(prisma.query)]

// queryResolvers.forEach(key => {
//   Query[key] = async (_, args, ctx, info) => {
//     const callback = () => prisma.query[key](args, info)
//     return createResolver(key, ctx, callback)
//   }
// })

// Query = {
//   ...Query,
//   tasks
// }

// export default Query
