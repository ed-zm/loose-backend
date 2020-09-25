import { objectType } from "@nexus/schema"

export default objectType({
  name: "Comment",
  definition(t) {
    t.model.id()
    t.model.text()
    t.model.user()
    t.model.task()
    t.model.createdAt()
    t.model.updatedAt()
  }
})