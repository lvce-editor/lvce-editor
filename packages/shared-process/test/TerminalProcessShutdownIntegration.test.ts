import { expect, test } from '@jest/globals'
import { IpcParentWithNodeForkedProcess } from '@lvce-editor/ipc'
import { createRequire } from 'node:module'
import * as ShutdownTerminalProcess from '../src/parts/ShutdownTerminalProcess/ShutdownTerminalProcess.ts'

const require = createRequire(import.meta.url)

test('the installed terminal process exits through its own control connection', async () => {
  const child = await IpcParentWithNodeForkedProcess.create({ path: require.resolve('@lvce-editor/pty-host') })
  try {
    const ipc = IpcParentWithNodeForkedProcess.wrap(child)
    await ShutdownTerminalProcess.shutdownTerminalProcess(ipc)
    expect(child.exitCode).toBe(0)
  } finally {
    if (child.exitCode === null) child.kill()
  }
}, 20_000)
