import { objectType } from '@nexus/schema'

export default objectType({
  name: 'GithubRepository',
  definition(t) {
    t.string('id')
    t.string('name')
    t.string('fullName')
    t.boolean('private')
    t.date('updatedAt')
    t.string('language')
    t.int('openIssuesCount')
    t.string('description')
    t.int('stargazersCount')
    t.int('forksCount')
  }
})
