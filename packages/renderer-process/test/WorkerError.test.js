import { expect, test, beforeAll } from '@jest/globals'
import { WorkerError } from '../src/parts/WorkerError/WorkerError.ts'

beforeAll(() => {
  // @ts-ignore
  globalThis.ErrorEvent = class {
    constructor(type, options) {
      this.type = type
      this.lineno = options.lineno
      this.colno = options.colno
      this.filename = options.filename
      this.message = options.message
    }
  }
})

test('WorkerError - ReferenceError', () => {
  const event = new ErrorEvent('error', {
    lineno: 1,
    colno: 1,
    filename: '/test/packages/renderer-worker/src/rendererWorkerMain.ts',
    message: 'Uncaught ReferenceError: TODO is not defined',
  })
  const error = new WorkerError(event)
  expect(error.message).toBe(`Uncaught ReferenceError: TODO is not defined`)
  expect(error.stack).toMatch(`Uncaught ReferenceError: TODO is not defined
    at Module (/test/packages/renderer-worker/src/rendererWorkerMain.ts:1:1)
    at Object.<anonymous>`)
})
