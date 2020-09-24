import { objectType } from '@nexus/schema'

export default objectType({
  name: 'GithubIssue',
  definition(t) {
    t.string('id')
    t.string('title')
    t.string('state')
    t.int('number')
    t.date('createdAt')
    t.date('updatedAt')
    t.date('closedAt')
    t.string('url')
    t.string('body')
    t.int('comments')
  }
})
