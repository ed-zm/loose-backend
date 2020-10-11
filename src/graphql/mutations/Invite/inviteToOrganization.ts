import moment from 'moment'
import authenticate from '../../../helpers/authenticate'
import { sendEmail } from '../../../helpers/email'
import uid from 'uid'

const resolve = async ({ args: { data }, ctx, user }: any) => {
  const to = data.to.connect.id
  let isOwner = null
  if(data.type === 'ORGANIZATION') {
    isOwner = await ctx.prisma.organization.findMany({
      where: {
        id: data.typeId,
        owner: {
          id: user.id
        }
      },
      select: {
        id: true
      }
    })
  }
  console.log('TO EMAIL', to, data.email)
  const invitedUser = await ctx.prisma.user.findMany({
    where: {
      AND: [
        { id: { equals: to } },
        { email: { equals: data.email } }
      ]
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true
    }
  })
  if(!!isOwner.length && (!!invitedUser.length || data.email)) {
    const organization = await ctx.prisma.organization.findOne({
      where: { id: data.typeId }
    })
    const currentUser = await ctx.prisma.user.findOne({
      where: {
        id: user.id
      },
      select: {
        id: true,
        firstName: true,
        lastName: true
      }
    })
    const code = uid(16)
    let url = `https://alpha.loose.dev/sign-up?inviteCode=${code}`
    if(invitedUser.length) url = `https://alpha.loose.dev/dashboard/invite/${code}`
    const title = `
    ${currentUser.firstName} ${currentUser.lastName} has invited you to join ${organization.name}`
    const text = `Hi ${!!invitedUser.length ? invitedUser[0].firstName : ''} ${!!invitedUser.length ? invitedUser[0].lastName : ''},
    ${currentUser.firstName} ${currentUser.lastName} has invited you to join the ${organization.name} Organization.
    Please go to ${url} to join.
    `
    const response = await ctx.prisma.invite.create({
      data: {
        ...data,
        to: to ? { connect: { id: to } } : undefined,
        type: 'ORGANIZATION',
        code,
        title,
        text,
        expireAt: moment().add(1, 'day').toISOString(),
        from: {
          connect: { id: user.id }
        }
      }
    })
    let ses = {}
    if(invitedUser.length) ses = await sendEmail([invitedUser[0].email], title, text)
    if(!invitedUser.length && data.email) {
      ses = await sendEmail([data.email], title, text)
    }
    //@ts-ignore
    if(ses.sent && !ses.error) {
      return response
    } else {
      throw new Error('We could not send the invite')
    }
  }
  throw new Error('You cannot invite')
}

export default {
  type: 'Invite',
  args: {
    data: 'InviteCreateInput'
  },
  nullable: false,
  resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
}
