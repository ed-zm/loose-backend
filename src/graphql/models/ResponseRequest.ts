import { objectType } from "@nexus/schema"

export default objectType({
  name: "ResponseRequest",
  definition(t) {
    t.model.id()
    t.model.task()
    t.model.title()
    t.model.description()
    t.model.state()
    t.model.createdBy()
    t.model.assignedTo()
    t.model.createdAt()
    t.model.updatedAt()
  }
})