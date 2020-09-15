import { S3, Endpoint } from 'aws-sdk'
import { stringArg, idArg, booleanArg } from '@nexus/schema'
import uid from 'uid'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { fileType, id, operation, random, folder = 'attachments' }, ctx, user }: any) => {
  const spacesEndpoint = new Endpoint(`${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`)
  const s3 = new S3({
    //@ts-ignore
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_ID,
    secretAccessKey: process.env.DO_SPACES_SECRET,
    region: process.env.DO_SPACES_REGION,
    signatureVersion: 'v4'
  })
  const extension = fileType.split('/')
  const key = `${random ? uid(10) : id}.${extension[1]}`
  const params = {
    Bucket: `${process.env.DO_SPACES_NAME}/${folder}`,
    Key: key,
    Expires: 600,
    ContentType: fileType,
    ACL: 'public-read'
  }
  const url = await s3.getSignedUrl(operation, params)
  return url
}

  export default {
    type: "String",
    args: {
      fileType: stringArg({ nullable: false }),
      id: idArg({ nullable: false }),
      operation: stringArg({ nullable: false }),
      random: booleanArg({ nullable: true }),
      folder: stringArg({ nullable: true })
    },
    nullable: false,
    resolve: async (_: any, args: any, ctx: any) => await authenticate({ args, ctx, resolve })
  }
