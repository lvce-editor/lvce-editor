import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'
import * as LaunchAboutViewWorker from '../LaunchAboutViewWorker/LaunchAboutViewWorker.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const worker = GetOrCreateWorker.getOrCreateWorker(LaunchAboutViewWorker.launchAboutViewWorker)
let activeInvocations = 0
let disposeRequested = false

const disposeIfUnused = async () => {
  // A replacement dialog can now own the worker that the old dialog released.
  if (!ViewletStates.getInstance(ViewletModuleId.About)) {
    await worker.dispose()
  }
}

const run = async (fn, method, params) => {
  activeInvocations++
  try {
    return await fn(method, ...params)
  } finally {
    activeInvocations--
    if (activeInvocations === 0 && disposeRequested) {
      disposeRequested = false
      await disposeIfUnused()
    }
  }
}

export const invoke = (method, ...params) => run(worker.invoke, method, params)

export const invokeAndTransfer = (method, ...params) => run(worker.invokeAndTransfer, method, params)

export const dispose = async () => {
  // Closing the widget can race the response to the RPC that opened it.
  // Return without waiting so callbacks can finish and release the worker.
  if (activeInvocations > 0) {
    disposeRequested = true
    return
  }
  await disposeIfUnused()
}
