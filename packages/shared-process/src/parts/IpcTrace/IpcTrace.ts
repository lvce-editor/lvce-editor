import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'

export interface TraceRecord {
  readonly [key: string]: unknown
}

interface Dependencies {
  readonly appendFile: typeof appendFile
  readonly cacheDirectory: string
  readonly mkdir: typeof mkdir
  readonly timeOrigin: number
}

export const state: Dependencies = {
  appendFile,
  cacheDirectory: PlatformPaths.cacheDir,
  mkdir,
  timeOrigin: performance.timeOrigin,
}

let writeChain: Promise<void> = Promise.resolve()
const initializedDirectories = new Set<string>()
const unsafeWorkerIdCharacterRegex = /[^a-z\d._-]/gi

export const sanitizeWorkerId = (workerId: string): string => {
  return workerId.replaceAll(unsafeWorkerIdCharacterRegex, '_') || 'unknown-worker'
}

export const getSessionName = (timeOrigin: number): string => {
  return new Date(timeOrigin).toISOString().replaceAll(':', '-')
}

export const appendWithDependencies = async (workerId: string, records: readonly TraceRecord[], dependencies: Dependencies): Promise<void> => {
  if (records.length === 0) {
    return
  }
  const sessionName = getSessionName(dependencies.timeOrigin)
  const traceDirectory = join(dependencies.cacheDirectory, 'ipcTraces', sessionName)
  if (!initializedDirectories.has(traceDirectory)) {
    await dependencies.mkdir(traceDirectory, { recursive: true })
    initializedDirectories.add(traceDirectory)
  }
  const fileName = `${sanitizeWorkerId(workerId)}.jsonl`
  const content = `${records.map((record) => JSON.stringify(record)).join('\n')}\n`
  await dependencies.appendFile(join(traceDirectory, fileName), content)
}

export const append = (workerId: string, records: readonly TraceRecord[]): Promise<void> => {
  const operation = writeChain.then(() => appendWithDependencies(workerId, records, state))
  writeChain = operation.catch(() => {})
  return operation
}

export const reset = (): void => {
  initializedDirectories.clear()
  writeChain = Promise.resolve()
}
