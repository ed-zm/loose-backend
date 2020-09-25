import { objectType } from "@nexus/schema"

export default objectType({
  name: "Label",
  definition(t) {
    t.model.id()
    t.model.text()
    t.model.color()
    t.model.organization()
    t.model.tasks()
    t.model.createdAt()
    t.model.updatedAt()
  }
})