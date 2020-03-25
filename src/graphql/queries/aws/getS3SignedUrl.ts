import { S3 } from 'aws-sdk'
import { stringArg, idArg } from 'nexus'

const resolve = async (_, { fileType, id, operation }, ctx, info) => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  })
  const extension = fileType.split('/')
  const key = `${id}.${extension[1]}`
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
      operation: stringArg({ nullable: false })
    },
    nullable: false,
    resolve
  }