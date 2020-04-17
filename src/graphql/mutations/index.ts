import { prismaObjectType } from "nexus-prisma";
import createTask from './Task/createTask'
import createLabel from './Label/createLabel'
import signIn from './auth/signIn'
import signUp from './auth/signUp'
import resendVerificationEmail from './auth/resendVerificationEmail'
import resetPassword from './auth/resetPassword'
import confirmEmail from './auth/confirmEmail'
import confirmResetPassword from './auth/confirmResetPassword'

// Use "*" to use all fields
export default prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.prismaFields([
      "createComment",
      "createOrganization",
      "updateTask",
      "deleteTask",
      "createTeam",
      "updateTeam",
      "updateUser"
    ]);
    //@ts-ignore
    t.field("createLabel", createLabel);
    //@ts-ignore
    t.field("createTask", createTask);
    //@ts-ignore
    t.field("confirmEmail", confirmEmail);
    //@ts-ignore
    t.field("confirmResetPassword", confirmResetPassword);
    //@ts-ignore
    t.field("resendVerificationEmail", resendVerificationEmail)
    //@ts-ignore
    t.field("resetPassword", resetPassword);
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
