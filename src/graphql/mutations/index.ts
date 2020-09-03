import { prismaObjectType } from "nexus-prisma";
import createOrganization from './Organization/createOrganization'
import updateOrganization from './Organization/updateOrganization'
import deleteOrganization from './Organization/deleteOrganization'
import updateUser from './User/updateUser'
import deleteUser from './User/deleteUser'
import createTeam from './Team/createTeam'
import updateTeam from './Team/updateTeam'
import deleteTeam from './Team/deleteTeam'
import createTask from './Task/createTask'
import updateTask from './Task/updateTask'
import deleteTask from './Task/deleteTask'
import updateResponseRequest from './ResponseRequest/updateResponseRequest'
import createLabel from './Label/createLabel'
import updateLabel from './Label/updateLabel'
import createComment from './Comment/createComment'
import updateComment from './Comment/updateComment'
import deleteComment from './Comment/deleteComment'
import signIn from './auth/signIn'
import githubLogin from './auth/githubLogin'
import signUp from './auth/signUp'
import resendVerificationEmail from './auth/resendVerificationEmail'
import resetPassword from './auth/resetPassword'
import confirmEmail from './auth/confirmEmail'
import confirmResetPassword from './auth/confirmResetPassword'
import importGithubIssues from './github/importIssues'
import importGithubCards from './github/importCards'
import inviteToOrganization from './Invite/inviteToOrganization'

// Use "*" to use all fields
export default prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.prismaFields([]);

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

    /* ------------------ RESPONSE REQUEST ------------------ */

    //@ts-ignore
    t.field("updateResponseRequest", updateResponseRequest);

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
    //@ts-ignore
    t.field("updateLabel", updateLabel);

    /* ------------------ COMMENT ------------------ */
    //@ts-ignore
    t.field("createComment", createComment);
    //@ts-ignore
    t.field("updateComment", updateComment);
    // //@ts-ignore
    t.field("deleteComment", deleteComment);

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
    //@ts-ignore
    t.field("inviteToOrganization", inviteToOrganization);
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
