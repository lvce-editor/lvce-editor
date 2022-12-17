import { VError } from '../src/parts/VError/VError.js'

test('VError - missing child stack', () => {
  class DOMException extends Error {
    constructor(message) {
      super(message)
      this.stack = undefined
      this.name = 'DOMException'
    }
  }
  const cause = new DOMException(
    'The requested version (1) is less than the existing version (6).'
  )
  const verror = new VError(cause, 'Failed to save IndexedDb value')
  expect(verror.stack).toMatch(
    'VError: Failed to save IndexedDb value: DOMException: The requested version (1) is less than the existing version (6).'
  )
})

test('VError - merging stacks', () => {
  const cause = new TypeError()
  cause.message = "Cannot read properties of undefined (reading 'match')"
  cause.stack = `Cannot read properties of undefined (reading 'match')
  at getProtocol (http://localhost:3000/packages/renderer-worker/src/parts/FileSystem/FileSystem.js:18:29)
  at Module.copy (http://localhost:3000/packages/renderer-worker/src/parts/FileSystem/FileSystem.js:110:20)
  at handleDropIntoFolder (http://localhost:3000/packages/renderer-worker/src/parts/ViewletExplorer/ViewletExplorerHandleDropIndex.js:14:22)`
  const verror = new VError(cause, 'Failed to drop files')
  expect(verror.stack).toBe(
    `VError: Failed to drop files: TypeError: Cannot read properties of undefined (reading \'match\')
  at getProtocol (http://localhost:3000/packages/renderer-worker/src/parts/FileSystem/FileSystem.js:18:29)
  at Module.copy (http://localhost:3000/packages/renderer-worker/src/parts/FileSystem/FileSystem.js:110:20)
  at handleDropIntoFolder (http://localhost:3000/packages/renderer-worker/src/parts/ViewletExplorer/ViewletExplorerHandleDropIndex.js:14:22)`
  )
})

test('VError - merging stacks - parent stack does not include message', () => {
  const error = new Error()
  error.message = 'Unknown command "ElectronWindowAbout.open"'
  error.stack = `  at exports.invoke (/test/packages/main-process/src/parts/Command/Command.js:64:13)
  at async exports.getResponse (/test/packages/main-process/src/parts/GetResponse/GetResponse.js:8:20)
  at async MessagePortMain.handleMessage (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:179:22)`
  const verror = new VError(error, 'Failed to open about window')
  expect(verror.message).toBe(
    'Failed to open about window: Error: Unknown command "ElectronWindowAbout.open"'
  )
  expect(verror.stack).toBe(
    `  at exports.invoke (/test/packages/main-process/src/parts/Command/Command.js:64:13)
  at async exports.getResponse (/test/packages/main-process/src/parts/GetResponse/GetResponse.js:8:20)
  at async MessagePortMain.handleMessage (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:179:22)`
  )
})

test('VError - merging stacks - parent has no stack but has line number and column number', () => {
  const error = new SyntaxError()
  error.message = `expected expression, got ','`
  error.stack = ''
  // @ts-ignore
  error.fileName =
    'http://localhost:3000/packages/renderer-process/src/parts/TestFrameWork/ElementActions.js'
  // @ts-ignore
  error.columnNumber = 47
  // @ts-ignore
  error.lineNumber = 17
  const verror = new VError(error, 'Failed to load module')
  expect(verror.message).toBe(
    "Failed to load module: SyntaxError: expected expression, got ','"
  )
  expect(verror.stack).toMatch(
    '  at http://localhost:3000/packages/renderer-process/src/parts/TestFrameWork/ElementActions.js:17:47'
  )
})
