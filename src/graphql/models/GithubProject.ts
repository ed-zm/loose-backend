import { objectType } from '@nexus/schema'

export default objectType({
  name: 'GithubProject',
  definition(t) {
    t.string('id')
    t.string('name')
    t.string('body')
    t.string('url')
    t.int('number')
    t.date('createdAt')
    t.date('updatedAt')
  }
})
