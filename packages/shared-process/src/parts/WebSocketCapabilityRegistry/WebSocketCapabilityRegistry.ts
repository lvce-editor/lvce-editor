import { randomBytes } from 'node:crypto'

export const capabilityProtocol = 'lvce-rpc'
export const capabilityProtocolPrefix = 'lvce-capability.'
export const capabilityTtl = 60_000

export interface WebSocketCapability {
  readonly expiresAt: number
  readonly extensionId?: string
  readonly modulePath?: string
  readonly rpcId?: string
  readonly target: string
}

const capabilities = new Map<string, WebSocketCapability>()

const cleanup = (now: number): void => {
  for (const [token, capability] of capabilities) {
    if (capability.expiresAt <= now) {
      capabilities.delete(token)
    }
  }
}

export const create = (target: string, options: Omit<WebSocketCapability, 'expiresAt' | 'target'> = {}): string => {
  const now = Date.now()
  cleanup(now)
  const token = randomBytes(32).toString('base64url')
  capabilities.set(token, {
    ...options,
    expiresAt: now + capabilityTtl,
    target,
  })
  return token
}

export const consume = (token: string): WebSocketCapability | undefined => {
  const now = Date.now()
  cleanup(now)
  const capability = capabilities.get(token)
  if (!capability) {
    return undefined
  }
  capabilities.delete(token)
  if (capability.expiresAt <= now) {
    return undefined
  }
  return capability
}

export const getProtocols = (token: string): readonly string[] => {
  return [capabilityProtocol, `${capabilityProtocolPrefix}${token}`]
}

export const clear = (): void => {
  capabilities.clear()
}
