import { objectType } from "@nexus/schema"

export default objectType({
  name: "User",
  definition(t) {
    t.model.id()
    t.model.stripeSubscriptionId()
    t.model.username()
    t.model.firstName()
    t.model.lastName()
    t.model.avatar()
    t.model.biography()
    t.model.email()
    t.model.emailVerifiedAt()
    t.model.emailVerificationCode()
    t.model.emailVerificationCodeIssuedAt()
    t.model.hash()
    t.model.resetPasswordCode()
    t.model.resetPasswordCodeIssuedAt()
    t.model.ownOrganizations()
    t.model.organizations()
    t.model.tasksCreated()
    t.model.tasksAssigned()
    t.model.teams()
    t.model.sentInvites()
    t.model.receivedInvites()
    t.model.createdAt()
    t.model.updatedAt()
  }
})
