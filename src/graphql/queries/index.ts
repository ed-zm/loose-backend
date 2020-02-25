import { prismaObjectType } from "nexus-prisma";

// Use "*" to use all fields
export default prismaObjectType({
  name: "Query",
  definition: (t) => t.prismaFields([
    "organizations",
    "task",
    "tasks",
    "user"
  ]),
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
