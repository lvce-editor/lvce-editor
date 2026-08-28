export interface OpenRequest {
  readonly kind: 'file' | 'folder'
  readonly path: string
}

interface Waiter {
  readonly resolve: (request: OpenRequest | undefined) => void
  readonly timeout: NodeJS.Timeout
}

const waiters: Waiter[] = []

const isOpenRequest = (value: unknown): value is OpenRequest => {
  const request = value as Partial<OpenRequest> | undefined
  return Boolean(
    request &&
      (request.kind === 'file' || request.kind === 'folder') &&
      typeof request.path === 'string' &&
      request.path.startsWith('/') &&
      !request.path.includes('\0'),
  )
}

export const open = (request: unknown): boolean => {
  if (!isOpenRequest(request)) {
    throw new TypeError('Invalid remote CLI open request')
  }
  const waiter = waiters.pop()
  if (!waiter) {
    return false
  }
  clearTimeout(waiter.timeout)
  waiter.resolve(request)
  return true
}

export const waitForOpenRequest = (
  timeoutMs = 30_000,
): Promise<OpenRequest | undefined> => {
  return new Promise((resolve) => {
    const waiter: Waiter = {
      resolve,
      timeout: setTimeout(() => {
        const index = waiters.indexOf(waiter)
        if (index !== -1) {
          waiters.splice(index, 1)
        }
        resolve(undefined)
      }, timeoutMs),
    }
    waiter.timeout.unref()
    waiters.push(waiter)
  })
}

export const _reset = (): void => {
  for (const waiter of waiters) {
    clearTimeout(waiter.timeout)
    waiter.resolve(undefined)
  }
  waiters.length = 0
}
