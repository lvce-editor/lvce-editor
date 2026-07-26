import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.js'

export const getOrCreateWorkerWithSleep = (launchWorker, sleepCommand, wakeUpCommand) => {
  const worker = GetOrCreateWorker.getOrCreateWorker(launchWorker)
  const activeInvocations = new Set()
  let hasSleepState = false
  let sleepState
  let sleepPromise
  let wakeUpPromise

  const wakeUp = () => {
    if (!hasSleepState) {
      return undefined
    }
    if (!wakeUpPromise) {
      const state = sleepState
      wakeUpPromise = worker
        .invoke(wakeUpCommand, state)
        .then(() => {
          hasSleepState = false
          sleepState = undefined
        })
        .finally(() => {
          wakeUpPromise = undefined
        })
    }
    return wakeUpPromise
  }

  const run = (fn) => {
    const invocation = (async () => {
      if (sleepPromise) {
        await sleepPromise
      }
      await wakeUp()
      return fn()
    })()
    activeInvocations.add(invocation)
    invocation.then(
      () => activeInvocations.delete(invocation),
      () => activeInvocations.delete(invocation),
    )
    return invocation
  }

  const invoke = (method, ...params) => {
    return run(() => worker.invoke(method, ...params))
  }

  const restart = (terminateCommand) => {
    return run(() => worker.restart(terminateCommand))
  }

  const sleep = (...params) => {
    if (!sleepPromise) {
      const currentInvocations = [...activeInvocations]
      sleepPromise = (async () => {
        await Promise.all(currentInvocations)
        await wakeUp()
        sleepState = await worker.invoke(sleepCommand, ...params)
        hasSleepState = true
        await worker.dispose()
      })().finally(() => {
        sleepPromise = undefined
      })
    }
    return sleepPromise
  }

  return {
    invoke,
    restart,
    sleep,
  }
}
