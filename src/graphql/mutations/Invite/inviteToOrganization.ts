import { arg } from '@nexus/schema'
import moment from 'moment'
import authenticate from '../../../helpers/authenticate'
import { sendEmail } from '../../../helpers/email'
import uid from 'uid'

const resolve = async ({ args: { data }, ctx, user }) => {
  const to = data.to.connect.id
  let isOwner = null
  if(data.type === 'ORGANIZATION') {
    isOwner = await ctx.prisma.$exists.organization({
      id: data.typeId,
      owner: {
        id: user.id
      }
    })
  }
  const invitedUser = await ctx.prisma.user({ id: to || '' }, '{ id, email, firstName, lastName }')
  if(!!isOwner && (!!invitedUser || data.email)) {
    const organization = await ctx.prisma.organization({
      id: data.typeId
    })
    const currentUser = await ctx.prisma.user({ id: user.id }, '{ id, firstName, lastName }')
    const code = uid(16)
    let url = `https://alpha.loose.dev/sign-up?inviteCode=${code}`
    if(invitedUser) url = `https://alpha.loose.dev/dashboard/invite/${code}`
    const title = `
    ${currentUser.firstName} ${currentUser.lastName} has invited you to join ${organization.name}`,
    const text = `Hi ${!!invitedUser ? invitedUser.firstName : ''} ${!!invitedUser ? invitedUser.lastName : ''},
    ${currentUser.firstName} ${currentUser.lastName} has invited you to join the ${organization.name} Organization.
    Please go to ${url} to join.
    `
    const response = await ctx.prisma.createInvite({
      ...data,
      to: to ? to : null,
      type: 'ORGANIZATION',
      code,
      title,
      text,
      expireAt: moment().add(1, 'day'),
      from: {
        connect: { id: user.id }
      }
    })
    let ses = {}
    if(invitedUser) ses = await sendEmail([invitedUser.email], title, text)
    if(!invitedUser && data.email) {
      ses = await sendEmail([data.email], title, text)
    }
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
