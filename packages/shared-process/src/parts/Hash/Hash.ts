import * as NodeCrypto from 'node:crypto'

export const fromString = (content) => {
  return NodeCrypto.createHash('sha1').update(content).digest('hex')
}

export const { createHash } = NodeCrypto
