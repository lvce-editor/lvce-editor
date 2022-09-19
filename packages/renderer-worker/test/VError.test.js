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
  const error = new VError(cause, `Failed to save IndexedDb value`)
  expect(error.stack).toMatch(
    'VError: Failed to save IndexedDb value: DOMException: The requested version (1) is less than the existing version (6).'
  )
})

test('VError - merging stacks', () => {
  const cause = new TypeError()
  cause.message = `Cannot read properties of undefined (reading 'match')`
  cause.stack = `Cannot read properties of undefined (reading 'match')
  at getProtocol (http://localhost:3000/packages/renderer-worker/src/parts/FileSystem/FileSystem.js:18:29)
  at Module.copy (http://localhost:3000/packages/renderer-worker/src/parts/FileSystem/FileSystem.js:110:20)
  at handleDropIntoFolder (http://localhost:3000/packages/renderer-worker/src/parts/ViewletExplorer/ViewletExplorerHandleDropIndex.js:14:22)`
  const error = new VError(cause, `Failed to drop files`)
  console.log(error.stack)
  expect(error.stack).toBe(
    `VError: Failed to drop files: TypeError: Cannot read properties of undefined (reading \'match\')
  at getProtocol (http://localhost:3000/packages/renderer-worker/src/parts/FileSystem/FileSystem.js:18:29)
  at Module.copy (http://localhost:3000/packages/renderer-worker/src/parts/FileSystem/FileSystem.js:110:20)
  at handleDropIntoFolder (http://localhost:3000/packages/renderer-worker/src/parts/ViewletExplorer/ViewletExplorerHandleDropIndex.js:14:22)`
  )
})
