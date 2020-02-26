import { prismaObjectType } from "nexus-prisma";
import organizations from './Organization/organizations'
import loggedIn from './auth/loggedIn'

// Use "*" to use all fields
export default prismaObjectType({
  name: "Query",
  definition(t) {
    t.prismaFields([
      "organization",
      "task",
      "tasks",
      "user",
      "users"
    ]);
    //@ts-ignore
    t.field("loggedIn", loggedIn)
    //@ts-ignore
    t.field('organizations', organizations)
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
