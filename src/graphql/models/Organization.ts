import { objectType } from "@nexus/schema"

export default objectType({
  name: "Organization",
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.githubToken()
    t.model.githubOrganization()
    t.model.owner()
    t.model.users()
    t.model.tasks()
    t.model.teams()
    t.model.labels()
    t.model.createdAt()
    t.model.updatedAt()
  }
})