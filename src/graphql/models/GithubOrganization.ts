import { objectType } from '@nexus/schema'

export default objectType({
  name: 'GithubOrganization',
  definition(t) {
    t.string('id')
    t.string('login')
    t.string('description')
  }
})
