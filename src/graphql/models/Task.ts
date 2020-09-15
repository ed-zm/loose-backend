import { objectType } from "@nexus/schema"

export default objectType({
  name: "Task",
  definition(t) {
    t.model.id()
    t.model.code()
    t.model.title()
    t.model.description()
    t.model.estimated()
    t.model.state()
    t.model.createdBy()
    t.model.assignedTo()
    t.model.organization()
    t.model.comments()
    t.model.team()
    t.model.labels()
    t.model.createdAt()
    t.model.updatedAt()
  }
})