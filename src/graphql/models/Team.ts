import { objectType } from "@nexus/schema"

export default objectType({
  name: "Team",
  definition(t) {
    t.model.id()
    t.model.id()
    t.model.name()
    t.model.users()
    t.model.tasks()
    t.model.organization()
    t.model.createdAt()
    t.model.updatedAt()
  }
})