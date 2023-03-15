const RestoreError = require('../src/parts/RestoreError/RestoreError.js')

test('restoreError - VError', () => {
  const cause = new Error('child process exited with code 1')
  cause.stack = `    at Module.create (file:///test/packages/shared-process/src/parts/IpcParentWithNodeForkedProcess/IpcParentWithNodeForkedProcess.js:16:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Module.create (file:///test/packages/shared-process/src/parts/IpcParent/IpcParent.js:6:18)
    at async createPtyHost (file:///test/packages/shared-process/src/parts/Terminal/Terminal.js:52:19)
    at async Module.create (file:///test/packages/shared-process/src/parts/Terminal/Terminal.js:79:23)`

  const error = {
    jse_shortmsg: 'Failed to create child process',
    jse_cause: cause,
  }
  const restoredError = RestoreError.restoreError(error)
  expect(restoredError).toBeInstanceOf(Error)
  expect(restoredError.message).toBe(`Failed to create child process: child process exited with code 1`)
  expect(restoredError.stack).toBe(`Failed to create child process: child process exited with code 1
    at Module.create (file:///test/packages/shared-process/src/parts/IpcParentWithNodeForkedProcess/IpcParentWithNodeForkedProcess.js:16:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Module.create (file:///test/packages/shared-process/src/parts/IpcParent/IpcParent.js:6:18)
    at async createPtyHost (file:///test/packages/shared-process/src/parts/Terminal/Terminal.js:52:19)
    at async Module.create (file:///test/packages/shared-process/src/parts/Terminal/Terminal.js:79:23)`)
})
