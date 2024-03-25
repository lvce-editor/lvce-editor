import { createWriteStream } from 'node:fs'
import { getHeapSnapshot } from 'node:v8'
import { pipeline } from 'node:stream/promises'

export const createHeapSnapshot = async () => {
  await pipeline(
    getHeapSnapshot(),
    // TODO get tmp dir from env
    createWriteStream(`/tmp/vscode-${Date.now()}.heapsnapshot`),
  )
}
