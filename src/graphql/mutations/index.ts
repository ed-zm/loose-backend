import { mutationType } from '@nexus/schema'
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

export default mutationType({
  definition(t) {
    /* ------------------ USER ------------------ */
    t.crud.updateOneUser(updateUser);
    t.crud.deleteOneUser(deleteUser);

    /* ------------------ ORGANIZATION ------------------ */
    t.crud.createOneOrganization(createOrganization);
    t.crud.updateOneOrganization(updateOrganization);
    t.crud.deleteOneOrganization(deleteOrganization);

    /* ------------------ TASK ------------------ */
    t.crud.createOneTask(createTask);
    t.crud.updateOneTask(updateTask);
    t.crud.deleteOneTask(deleteTask);

    /* ------------------ RESPONSE REQUEST ------------------ */

    t.crud.updateOneResponseRequest(updateResponseRequest);

    /* ------------------ TEAM ------------------ */
    t.crud.createOneTeam(createTeam);
    t.crud.updateOneTeam(updateTeam);
    t.crud.deleteOneTeam(deleteTeam);

    /* ------------------ LABEL ------------------ */
    t.crud.createOneLabel(createLabel);
    t.crud.updateOneLabel(updateLabel);

    /* ------------------ COMMENT ------------------ */
    t.crud.createOneComment(createComment);
    t.crud.updateOneComment(updateComment);
    t.crud.deleteOneComment(deleteComment);

    /* ------------------ CUSTOM ------------------ */
    // @ts-ignore
    t.field("confirmEmail", confirmEmail);
    // @ts-ignore
    t.field("confirmResetPassword", confirmResetPassword);
    // @ts-ignore
    t.field('importGithubCards', importGithubCards)
    // @ts-ignore
    t.field('importGithubIssues', importGithubIssues)
    // @ts-ignore
    t.field("resendVerificationEmail", resendVerificationEmail)
    // @ts-ignore
    t.field("resetPassword", resetPassword);
    // @ts-ignore
    t.field("signIn", signIn);
    // @ts-ignore
    t.field("githubLogin", githubLogin);
    // @ts-ignore
    t.field("signUp", signUp);
    // @ts-ignore
    // t.field("inviteToOrganization", inviteToOrganization);
  },
});
