import { objectType } from "@nexus/schema"

export default objectType({
  name: "Invite",
  definition(t) {
    t.model.id()
    t.model.code()
    t.model.from()
    t.model.to()
    t.model.email()
    t.model.title()
    t.model.text()
    t.model.type()
    t.model.expireAt()
    t.model.createdAt()
    t.model.updatedAt()
  }
})