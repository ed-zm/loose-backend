import { prismaObjectType } from "nexus-prisma";
import signIn from './auth/signIn'
import signUp from './auth/signUp'

// Use "*" to use all fields
export default prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.prismaFields([
      "createOrganization",
      "createTask"
    ]);
    //@ts-ignore
    t.field("signIn", signIn);
    //@ts-ignore
    t.field("signUp", signUp);
  },
});

// import prisma from '../../prisma'
// import signIn from './signIn'
// import signUp from './signUp'
// import publicResolvers from '../../helpers/publicResolvers'
// import authenticate from '../../helpers/authenticate'

// const Mutation = {
//   signIn,
//   signUp
// }
// const mutationResolvers = Object.keys(prisma.mutation)

// mutationResolvers.forEach(key => {
//   Mutation[key] = async (_, args, ctx, info) => {
//     const isPublic = publicResolvers.find(p => p === key)
//     if(isPublic) {
//       return prisma.mutation[key](args, info)
//     } else {
//       const authenticated = await authenticate(ctx)
//       if(authenticated) {
//         return prisma.mutation[key](args, info)
//       } else {
//         throw new Error("Unauthenticated")
//       }
//     }
//   }
// })

// export default Mutation
