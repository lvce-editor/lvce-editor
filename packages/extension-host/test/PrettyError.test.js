import { jest } from '@jest/globals'
import { ExecutionError } from '../src/parts/Error/Error.js'

jest.unstable_mockModule('node:fs', () => ({
  readFileSync: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const fs = await import('node:fs')
const PrettyError = await import('../src/parts/PrettyError/PrettyError.js')

test('prepare', async () => {
  const error = new Error()
  error.message = 'oops'
  const testFile =
    process.platform === 'win32'
      ? 'file:///C:/test/test.js'
      : 'file:///test/test.js'
  error.stack = `Error: oops
  at makeError (${testFile}:2:9)
  at ${testFile}:6:3
  at ModuleJob.run (node:internal/modules/esm/module_job:198:25)
  at async Promise.all (index 0)
  at async ESMLoader.import (node:internal/modules/esm/loader:409:24)
  at async loadESM (node:internal/process/esm_loader:85:5)
  at async handleMainPromise (node:internal/modules/run_main:61:12)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `const makeError = () => {
  throw new Error('oops')
}

try {
  makeError()
} catch (error) {
  console.log(error.stack)
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message: 'oops',
    stack: `  at makeError (${testFile}:2:9)
  at ${testFile}:6:3
  at async Promise.all (index 0)`,
    codeFrame: `  1 | const makeError = () => {
> 2 |   throw new Error('oops')
    |         ^
  3 | }
  4 |
  5 | try {`,
  })
})

test('prepare - extension activation error', async () => {
  const prefix = process.platform === 'win32' ? 'file:///C:' : 'file://'
  const mainJs = prefix + '/test/extensions/sample.error-on-activate/main.js'
  const extensionManagementJs =
    prefix + '/test/ExtensionManagement/ExtensionManagement.js'
  const sharedProcessJs = prefix + '/test/SharedProcess/SharedProcess.js'
  const cause = new Error()
  cause.message = 'oops'
  cause.stack = `Error: oops
  at Module.activate (${mainJs}:2:9)
  at enable (${extensionManagementJs}:80:27)
  at async process.handleMessage (${sharedProcessJs}:51:20)`

  const error = new ExecutionError({
    cause,
    message:
      'Failed to load extension "sample.error-on-activate-with-source-map"',
  })
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `export const activate = () => {
  throw new Error('oops')
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message:
      'Failed to load extension "sample.error-on-activate-with-source-map": oops',
    stack: `  at Module.activate (${mainJs}:2:9)
  at enable (${extensionManagementJs}:80:27)
  at async process.handleMessage (${sharedProcessJs}:51:20)`,
    codeFrame: `  1 | export const activate = () => {
> 2 |   throw new Error('oops')
    |         ^
  3 | }
  4 |`,
  })
})

test('prepare - extension activation error with source map', async () => {
  const cause = new Error()
  cause.message = 'oops'
  cause.stack = `/test/extensions/sample.error-on-activate-with-source-map/main.ts:2
  throw new Error('oops')
        ^


Error: oops
    at null.activate (/test/extensions/sample.error-on-activate-with-source-map/main.ts:2:9)
    at async Promise.all (index 0)
    at async enable (file:///test/ExtensionManagement/ExtensionManagement.js:71:14)
    at async process.handleMessage (file:///test/SharedProcess/SharedProcess.js:51:20)`
  const error = new ExecutionError({
    cause,
    message:
      'Failed to load extension "sample.error-on-activate-with-source-map"',
  })

  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `export const activate = () => {
  throw new Error('oops')
}
`
  })
  const prettyError = PrettyError.prepare(error)
  expect(prettyError).toEqual({
    message:
      'Failed to load extension "sample.error-on-activate-with-source-map": oops',
    stack: `    at null.activate (/test/extensions/sample.error-on-activate-with-source-map/main.ts:2:9)
    at async Promise.all (index 0)
    at async enable (file:///test/ExtensionManagement/ExtensionManagement.js:71:14)
    at async process.handleMessage (file:///test/SharedProcess/SharedProcess.js:51:20)`,
    codeFrame: `  1 | export const activate = () => {
> 2 |   throw new Error('oops')
    |         ^
  3 | }
  4 |`,
  })
})

test('prepareJsonError', async () => {
  const prettyError = PrettyError.prepareJsonError(
    {
      main: [],
    },
    'main'
  )
  expect(prettyError).toEqual({
    stack: '',
    codeFrame: `  1 | {
> 2 |   \"main\": []
    |          ^
  3 | }
  4 |`,
  })
})

test('prepare - error with internal websocket stack trace', () => {
  const error = new Error()
  error.message = 'oops'
  const filePrefix = process.platform === 'win32' ? 'file:///C:' : `file://`
  error.stack = `Error: Failed to execute reference provider: oops
    at Object.provideReferences (${filePrefix}/test/lvce-editor/packages/e2e/fixtures/sample.reference-provider-error/main.js:5:11)
    at executeReferenceProvider (${filePrefix}/test/lvce-editor/packages/extension-host/src/parts/ExtensionHostReference/ExtensionHostReference.js:43:48)
    at Module.invoke (${filePrefix}/test/lvce-editor/packages/extension-host/src/parts/InternalCommand/InternalCommand.js:149:10)
    at handleMessage (${filePrefix}/test/lvce-editor/packages/extension-host/src/parts/SharedProcess/SharedProcess.js:83:44)
    at WebSocket.wrappedListener (${filePrefix}/test/lvce-editor/packages/extension-host/src/parts/Ipc/IpcWithWebSocket.js:59:13)
    at Receiver.receiverOnMessage (/test/lvce-editor/packages/extension-host/node_modules/ws/lib/websocket.js:1178:20)
    at Receiver.dataMessage (/test/lvce-editor/packages/extension-host/node_modules/ws/lib/receiver.js:528:14)
    at Receiver.getData (/test/lvce-editor/packages/extension-host/node_modules/ws/lib/receiver.js:446:17)`
  // @ts-ignore
  fs.readFileSync.mockImplementation(() => {
    return `export const activate = () => {
  throw new Error('oops')
}
`
  })
  const prettyError = PrettyError.prepare(error)
  // TODO in this case, only the first two stack lines are actually relevant
  expect(prettyError.stack)
    .toBe(`    at Object.provideReferences (${filePrefix}/test/lvce-editor/packages/e2e/fixtures/sample.reference-provider-error/main.js:5:11)
    at executeReferenceProvider (${filePrefix}/test/lvce-editor/packages/extension-host/src/parts/ExtensionHostReference/ExtensionHostReference.js:43:48)
    at Module.invoke (${filePrefix}/test/lvce-editor/packages/extension-host/src/parts/InternalCommand/InternalCommand.js:149:10)
    at handleMessage (${filePrefix}/test/lvce-editor/packages/extension-host/src/parts/SharedProcess/SharedProcess.js:83:44)
    at WebSocket.wrappedListener (${filePrefix}/test/lvce-editor/packages/extension-host/src/parts/Ipc/IpcWithWebSocket.js:59:13)`)
})
