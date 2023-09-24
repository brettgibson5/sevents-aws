import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

const s3Client = new S3Client({})
export const handler = async (event: any) => {
  const { id } = event.pathParameters

  const command = new GetObjectCommand({
    Key: `${id}.txt`,
    Bucket: process.env.BUCKET_NAME,
  })

  try {
    const { Body } = await s3Client.send(command)
    const content = await streamToString(Body)
    return { statusCode: 200, body: content }
  } catch (err) {
    return { statusCode: 500, body: 'Oops' }
  }
}
// function for convert response from S3 into string
async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
  })
}
