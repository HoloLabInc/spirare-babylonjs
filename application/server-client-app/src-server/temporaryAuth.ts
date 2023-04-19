import { createHmac } from 'crypto'
import { randomBytes } from 'crypto'

function generateRandomString(length: number) {
  return randomBytes(length).reduce((p, i) => p + (i % 36).toString(36), '')
}

const secret = process.env.SIGNATURE_SECRET || generateRandomString(32)

export type ObjectToSign = {
  userId: string
  pomlId: string
  signedExpiry: Date
}

export const generateSignature = (object: ObjectToSign): string => {
  const hmac = createHmac('sha256', secret)
  const json = JSON.stringify(object)
  hmac.update(json)
  const signature = hmac.digest('base64')
  return signature
}

export const verifySignature = (
  object: ObjectToSign,
  signature: string
): boolean => {
  const expectedSignature = generateSignature(object)
  return signature == expectedSignature
}
