import * as FirstWorkerEventType from '../src/parts/FirstWorkerEventType/FirstWorkerEventType.js'
import * as GetFirstWorkerEvent from '../src/parts/GetFirstWorkerEvent/GetFirstWorkerEvent.js'

class TestWorker {
  constructor() {
    this._onerror = undefined
    this._onmessage = undefined
  }

  get onmessage() {
    return this._onmessage
  }

  set onmessage(listener) {
    this._onmessage = listener
  }

  set onerror(listener) {
    this._onerror = listener
  }

  get onerror() {
    return this._onerror
  }

  dispatchMessage(event) {
    if (this._onmessage) {
      this._onmessage(event)
    }
  }

  dispatchError(event) {
    if (this._onerror) {
      this._onerror(event)
    }
  }
}

test('getFirstWorkerEvent - message', async () => {
  const worker = new TestWorker()
  const promise = GetFirstWorkerEvent.getFirstWorkerEvent(worker)
  const event = {}
  worker.dispatchMessage(event)
  expect(await promise).toEqual({
    type: FirstWorkerEventType.Message,
    event,
  })
  expect(worker.onmessage).toBeNull()
  expect(worker.onerror).toBeNull()
})

test('getFirstWorkerEvent - error', async () => {
  const worker = new TestWorker()
  const promise = GetFirstWorkerEvent.getFirstWorkerEvent(worker)
  const event = {}
  worker.dispatchError(event)
  expect(await promise).toEqual({
    type: FirstWorkerEventType.Error,
    event,
  })
  expect(worker.onmessage).toBeNull()
  expect(worker.onerror).toBeNull()
})
