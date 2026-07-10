import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { getHeapSnapshot } from 'node:v8'

export const createHeapSnapshot = async (): Promise<any> => {
  await pipeline(
    getHeapSnapshot(),
    // TODO get tmp dir from env or pass it as parameter
    createWriteStream(`/tmp/vscode-${Date.now()}.heapsnapshot`),
  )
}
