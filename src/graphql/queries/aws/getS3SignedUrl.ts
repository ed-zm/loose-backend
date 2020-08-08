import { S3 } from 'aws-sdk'
import { stringArg, idArg, booleanArg } from 'nexus'
import uid from 'uid'
import authenticate from '../../../helpers/authenticate'

const resolve = async ({ args: { fileType, id, operation, random }, ctx, user }) => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  })
  const extension = fileType.split('/')
  const key = `${random ? uid(10) : id}.${extension[1]}`
  const params = {
    Bucket: `dev.loose.www.avatars`,
    Key: key,
    Expires: 600,
    ContentType: fileType
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
      random: booleanArg({ nullable: true })
    },
    nullable: false,
    resolve: async (_, args, ctx, info) => await authenticate({ args, ctx, info, resolve })
  }
