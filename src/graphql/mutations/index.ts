import { prismaObjectType } from "nexus-prisma";
import createOrganization from './Organization/createOrganization'
import updateOrganization from './Organization/updateOrganization'
import deleteOrganization from './Organization/deleteOrganization'
import updateUser from './User/updateUser'
import deleteUser from './User/deleteUser'
import updateTeam from './Team/updateTeam'
import deleteTeam from './Team/deleteTeam'
import createTask from './Task/createTask'
import updateTask from './Task/updateTask'
import deleteTask from './Task/deleteTask'
import createLabel from './Label/createLabel'
import createComment from './Comment/createComment'
import signIn from './auth/signIn'
import githubLogin from './auth/githubLogin'
import signUp from './auth/signUp'
import resendVerificationEmail from './auth/resendVerificationEmail'
import resetPassword from './auth/resetPassword'
import confirmEmail from './auth/confirmEmail'
import confirmResetPassword from './auth/confirmResetPassword'
import importGithubIssues from './github/importIssues'
import importGithubCards from './github/importCards'

// Use "*" to use all fields
export default prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.prismaFields([
    ]);

    /* ------------------ USER ------------------ */
    //@ts-ignore
    t.field("updateUser", updateUser);
    //@ts-ignore
    t.field("deleteUser", deleteUser);

    /* ------------------ ORGANIZATION ------------------ */
    //@ts-ignore
    t.field("createOrganization", createOrganization);
    //@ts-ignore
    t.field("updateOrganization", updateOrganization);
    //@ts-ignore
    t.field("deleteOrganization", deleteOrganization);

    /* ------------------ TASK ------------------ */
    //@ts-ignore
    t.field("createTask", createTask);
    //@ts-ignore
    t.field("updateTask", updateTask);
    //@ts-ignore
    t.field("deleteTask", deleteTask);

    /* ------------------ TEAM ------------------ */
    //@ts-ignore
    t.field("createTeam", createTeam);
    //@ts-ignore
    t.field("updateTeam", updateTeam);
    //@ts-ignore
    t.field("deleteTeam", deleteTeam);

    /* ------------------ LABEL ------------------ */
    //@ts-ignore
    t.field("createLabel", createLabel);

    /* ------------------ COMMENT ------------------ */
    //@ts-ignore
    t.field("createComment", createComment);

    /* ------------------ CUSTOM ------------------ */
    //@ts-ignore
    t.field("confirmEmail", confirmEmail);
    //@ts-ignore
    t.field("confirmResetPassword", confirmResetPassword);
    //@ts-ignore
    t.field('importGithubCards', importGithubCards)
    //@ts-ignore
    t.field('importGithubIssues', importGithubIssues)
    //@ts-ignore
    t.field("resendVerificationEmail", resendVerificationEmail)
    //@ts-ignore
    t.field("resetPassword", resetPassword);
    //@ts-ignore
    t.field("signIn", signIn);
    //@ts-ignore
    t.field("githubLogin", githubLogin);
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
