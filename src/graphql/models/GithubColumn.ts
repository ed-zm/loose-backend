import { objectType } from '@nexus/schema'

export default objectType({
  name: 'GithubColumn',
  definition(t) {
    t.string('id')
    t.string('name')
    t.date('createdAt')
    t.date('updatedAt')
  }
})
