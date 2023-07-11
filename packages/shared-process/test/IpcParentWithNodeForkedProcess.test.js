import { jest } from '@jest/globals'
import * as FirstNodeWorkerEventType from '../src/parts/FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'

jest.unstable_mockModule('../src/parts/GetFirstNodeChildProcessEvent/GetFirstNodeChildProcessEvent.js', () => {
  return {
    getFirstNodeChildProcessEvent: jest.fn(),
  }
})

jest.unstable_mockModule('node:child_process', () => {
  return {
    fork: jest.fn(),
  }
})

const GetFirstNodeChildProcessEvent = await import('../src/parts/GetFirstNodeChildProcessEvent/GetFirstNodeChildProcessEvent.js')
const IpcParentWithNodeForkedProcess = await import('../src/parts/IpcParentWithNodeForkedProcess/IpcParentWithNodeForkedProcess.js')
const NodeChildProcess = await import('node:child_process')

test('create - error - child process exits with code 1', async () => {
  // @ts-ignore
  NodeChildProcess.fork.mockImplementation(() => {
    return {}
  })
  // @ts-ignore
  GetFirstNodeChildProcessEvent.getFirstNodeChildProcessEvent.mockImplementation(() => {
    return {
      type: FirstNodeWorkerEventType.Exit,
      event: 1,
    }
  })
  await expect(IpcParentWithNodeForkedProcess.create({ path: '/test/childProcess.js', argv: [], env: {}, execArgv: [] })).rejects.toThrowError(
    new Error(`Failed to launch child process: ChildProcessError: child process error: undefined`)
  )
})

test('create', async () => {
  // @ts-ignore
  NodeChildProcess.fork.mockImplementation(() => {
    return {}
  })
  // @ts-ignore
  GetFirstNodeChildProcessEvent.getFirstNodeChildProcessEvent.mockImplementation(() => {
    return {
      type: FirstNodeWorkerEventType.Message,
      event: 'ready',
    }
  })
  const childProcess = await IpcParentWithNodeForkedProcess.create({ path: '/test/childProcess.js', argv: [], env: {}, execArgv: [] })
  expect(childProcess).toBeDefined()
})
