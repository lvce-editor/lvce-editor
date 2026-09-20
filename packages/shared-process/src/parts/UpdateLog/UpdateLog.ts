import { appendFileSync, mkdirSync, openSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'

export const getPath = (): string => {
  const directory = fileURLToPath(PlatformPaths.getLogsDir())
  mkdirSync(directory, { recursive: true })
  return join(directory, 'log-updates.txt')
}

// Synchronous appends ensure the last handoff/error is on disk before shutdown.
export const write = (message: string): void => {
  const path = getPath()
  const line = `${new Date().toISOString()} [updates pid=${process.pid}] ${message.replaceAll('\n', '\\n').replaceAll('\r', '\\r')}\n`
  appendFileSync(path, line)
  appendFileSync(join(fileURLToPath(PlatformPaths.getLogsDir()), 'log-shared-process.txt'), line)
}

export const openOutput = (): number => openSync(getPath(), 'a')

export const writeSafe = (message: string): void => {
  try {
    write(message)
  } catch (error) {
    console.error('Failed to persist update diagnostics', error)
  }
}
