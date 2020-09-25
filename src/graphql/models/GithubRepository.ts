import { objectType } from '@nexus/schema'

export default objectType({
  name: 'GithubRepository',
  definition(t) {
    t.string('id')
    t.string('name')
    t.string('fullName')
    t.boolean('private')
    t.date('updatedAt')
    t.string('language', { nullable: true })
    t.int('openIssuesCount')
    t.string('description', { nullable: true })
    t.int('stargazersCount')
    t.int('forksCount')
  }
})
