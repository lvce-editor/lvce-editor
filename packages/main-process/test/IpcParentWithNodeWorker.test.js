import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

jest.unstable_mockModule('node:worker_threads', () => {
  return {
    Worker: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js', () => {
  return {
    getFirstNodeWorkerEvent: jest.fn(),
  }
})

const IpcParentWithNodeWorker = await import('../src/parts/IpcParentWithNodeWorker/IpcParentWithNodeWorker.js')
const GetFirstNodeWorkerEvent = await import('../src/parts/GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js')
const WorkerThreads = await import('node:worker_threads')

test('create - error - module not found', async () => {
  // @ts-ignore
  GetFirstNodeWorkerEvent.getFirstNodeWorkerEvent.mockImplementation(() => {
    const error = new Error(
      `[ERR_MODULE_NOT_FOUND]: Cannot find module '/test/packages/shared-process/src/parts/ErrorType/ErrorType.js' imported from /test/packages/shared-process/src/parts/GetErrorConstructor/GetErrorConstructor.js`,
    )
    error.stack = `[ERR_MODULE_NOT_FOUND]: Cannot find module '/test/packages/shared-process/src/parts/ErrorType/ErrorType.js' imported from /test/packages/shared-process/src/parts/GetErrorConstructor/GetErrorConstructor.js
  at __node_internal_captureLargerStackTrace (node:internal/errors:490:5)
  at new NodeError (node:internal/errors:399:5)
  at finalizeResolution (node:internal/modules/esm/resolve:326:11)
  at moduleResolve (node:internal/modules/esm/resolve:951:10)
  at defaultResolve (node:internal/modules/esm/resolve:1159:11)
  at nextResolve (node:internal/modules/esm/loader:163:28)
  at ESMLoader.resolve (node:internal/modules/esm/loader:838:30)
  at ESMLoader.getModuleJob (node:internal/modules/esm/loader:424:18)
  at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:77:40)
  at link (node:internal/modules/esm/module_job:76:36)
`
    // @ts-ignore
    error.code = 'ERR_MODULE_NOT_FOUND'
    return {
      type: 'error',
      event: error,
    }
  })
  await expect(
    IpcParentWithNodeWorker.create({
      path: 'not-found.js',
    }),
  ).rejects.toThrow(
    new Error(
      `Worker threw an error before ipc connection was established: Error: [ERR_MODULE_NOT_FOUND]: Cannot find module '/test/packages/shared-process/src/parts/ErrorType/ErrorType.js' imported from /test/packages/shared-process/src/parts/GetErrorConstructor/GetErrorConstructor.js`,
    ),
  )
})

test('create - error - path is not defined', async () => {
  // @ts-ignore
  await expect(IpcParentWithNodeWorker.create({})).rejects.toThrow(new Error('expected value to be of type string'))
})

test('create', async () => {
  // @ts-ignore
  GetFirstNodeWorkerEvent.getFirstNodeWorkerEvent.mockImplementation(() => {
    return {
      type: 'message',
      event: 'ready',
    }
  })
  const worker = await IpcParentWithNodeWorker.create({
    path: 'file.js',
    env: {},
  })
  expect(worker).toBeDefined()
  expect(worker).toBeInstanceOf(WorkerThreads.Worker)
  expect(WorkerThreads.Worker).toHaveBeenCalledTimes(1)
  expect(WorkerThreads.Worker).toHaveBeenCalledWith('file.js', {
    argv: ['--ipc-type=node-worker'],
    env: expect.objectContaining({ ELECTRON_RUN_AS_NODE: '1' }),
    execArgv: [],
  })
})
