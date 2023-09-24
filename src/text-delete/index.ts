import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({})
export const handler = async (event: any) => {
  const { id } = event.pathParameters

  const command = new DeleteObjectCommand({
    Key: `${id}.txt`,
    Bucket: process.env.BUCKET_NAME,
  })

  try {
    await s3Client.send(command)
  } catch (err) {
    return { statusCode: 500, body: 'Oops' }
  }

  return { statusCode: 200, body: `${id}.txt deleted` }
}
