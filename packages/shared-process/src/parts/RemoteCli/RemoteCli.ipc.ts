import type { OpenRequest } from './RemoteCli.ts'
import * as RemoteCli from './RemoteCli.ts'

export const name = 'RemoteCli'

export const Commands: {
  readonly open: (request: unknown) => boolean
  readonly waitForOpenRequest: (
    timeoutMs?: number,
  ) => Promise<OpenRequest | undefined>
} = {
  open: RemoteCli.open,
  waitForOpenRequest: RemoteCli.waitForOpenRequest,
}
