import { objectType } from '@nexus/schema'

export default objectType({
  name: 'GithubCard',
  definition(t) {
    t.string('id')
    t.string('note')
    t.boolean('archived')
    t.date('createdAt')
    t.date('updatedAt')
  }
})
