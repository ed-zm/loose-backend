import { queryType } from '@nexus/schema'
import getS3SignedUrl from './aws/getS3SignedUrl'
import organizations from './Organization/organizations'
import loggedIn from './auth/loggedIn'
import tasks from './Task/tasks'
import task from './Task/task'
import responseRequests from './ResponseRequest/responseRequests'
import teams from './Team/teams'
import comments from './Comment/comments'
import users from './User/users'
import githubCards from './github/cards'
import githubColumns from './github/columns'
import githubOrganizations from './github/organizations'
import githubProjects from './github/projects'
import githubRepositories from './github/repositories'
import githubIssues from './github/issues'
import invite from './Invite/invite'

export default queryType({
  definition(t) {
    t.crud.user()
    t.crud.team()
    t.crud.task()
    t.crud.organization()
    t.crud.labels({
      filtering: true
    })
    t.crud.label()
    t.field("getS3SignedUrl", getS3SignedUrl)
    t.field("loggedIn", loggedIn)
    t.crud.organizations(organizations)
    t.crud.teams(teams)
    t.crud.comments(comments)
    t.crud.users(users)
    t.field('invite', invite)
    t.crud.invites({
      filtering: true
    })
    t.field('githubCards', githubCards)
    t.field('githubColumns', githubColumns)
    t.field('githubOrganizations', githubOrganizations)
    t.field('githubProjects', githubProjects)
    t.field('githubRepositories', githubRepositories)
    t.field('githubIssues', githubIssues)
    t.crud.responseRequests(responseRequests)
    t.crud.tasks(tasks)
    t.crud.task(task)
  }
})
