import { arg } from 'nexus'
import moment from 'moment'
import authenticate from '../../../helpers/authenticate'
import { sendEmail } from '../../../helpers/email'
import uid from 'uid'

const resolve = async ({ args: { data }, ctx, user }) => {
  const isOwner = await ctx.prisma.$exists.organization({
    id: data.typeId,
    owner: {
      id: user.id
    }
  })
  const invitedUser = await ctx.prisma.user({ id: data.to.connect.id }, '{ id, email, firstName, lastName }')
  if(!!isOwner && !!invitedUser) {
    const organization = await ctx.prisma.organization({
      id: data.typeId
    })
    const currentUser = await ctx.prisma.user({ id: user.id }, '{ id, firstName, lastName }')
    const code = uid(16)
    const title = `
    ${currentUser.firstName} ${currentUser.lastName} has invited you to join ${organization.name}`,
    const text = `Hi ${invitedUser.firstName} ${invitedUser.lastName},
    ${currentUser.firstName} ${currentUser.lastName} has invited you to join the ${organization.name} Organization.
    Please go to https://alpha.loose.dev/dashboard/invite/${code} to join.
    `
    const response = await ctx.prisma.createInvite({
      ...data,
      type: 'ORGANIZATION',
      code,
      title,
      text,
      expireAt: moment().add(1, 'day'),
      from: {
        connect: { id: user.id }
      }
    })
    const ses = await sendEmail([invitedUser.email], title, text)
    if(ses.sent && !ses.error) {
      return response
    } else {
      throw new Error('We could not send the invite')
    }
  }
  throw new Error('You cannot invite')
}

export default {
  type: "Invite",
  args: {
    data: arg({ type: 'InviteCreateInput', required: true })
  },
  nullable: false,
  resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
}
