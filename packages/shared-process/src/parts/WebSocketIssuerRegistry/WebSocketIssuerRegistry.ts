import { randomBytes } from 'node:crypto'

export const issuerTtl = 24 * 60 * 60 * 1000

const issuers = new Map<string, number>()

const cleanup = (now: number): void => {
  for (const [issuer, expiresAt] of issuers) {
    if (expiresAt <= now) {
      issuers.delete(issuer)
    }
  }
}

export const create = (): string => {
  const now = Date.now()
  cleanup(now)
  const issuer = randomBytes(32).toString('base64url')
  issuers.set(issuer, now + issuerTtl)
  return issuer
}

export const isValid = (issuer: string): boolean => {
  const now = Date.now()
  cleanup(now)
  const expiresAt = issuers.get(issuer)
  return typeof expiresAt === 'number' && expiresAt > now
}

export const clear = (): void => {
  issuers.clear()
}
