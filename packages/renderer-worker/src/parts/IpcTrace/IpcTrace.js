import * as GetIpcTraceTransferrables from '../GetIpcTraceTransferrables/GetIpcTraceTransferrables.ts'
import * as IpcTraceConfig from '../IpcTraceConfig/IpcTraceConfig.js'
import * as Process from '../Process/Process.js'
import * as SerializeIpcTraceMessage from '../SerializeIpcTraceMessage/SerializeIpcTraceMessage.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const flushRecordCount = 100
const flushDelay = 100

/** @type {any} */
export const state = {
  batches: new Map(),
  connectionId: 0,
  disabled: false,
  flushTimer: undefined,
  getArgv: Process.getArgv,
  getTransferrables: GetIpcTraceTransferrables.getIpcTraceTransferrables,
  now: () => performance.now(),
  optionsPromise: undefined,
  pendingRecordCount: 0,
  serialize: SerializeIpcTraceMessage.serializeIpcTraceMessage,
  setTimeout: (callback, delay) => globalThis.setTimeout(callback, delay),
  timeOrigin: () => performance.timeOrigin,
  wallTime: () => new Date().toISOString(),
  write: (workerId, records) => SharedProcess.invoke('IpcTrace.append', workerId, records),
  writeChain: Promise.resolve(),
  writeStderr: Process.writeStderr,
}

const reportError = (error) => {
  if (state.disabled) {
    return
  }
  state.disabled = true
  if (state.flushTimer !== undefined) {
    clearTimeout(state.flushTimer)
    state.flushTimer = undefined
  }
  state.batches.clear()
  state.pendingRecordCount = 0
  const message = error instanceof Error ? error.message : String(error)
  console.error(`IPC tracing disabled: ${message}`)
  void Promise.resolve(state.writeStderr(`IPC tracing disabled: ${message}\n`)).catch(() => {})
}

const getOptions = async () => {
  state.optionsPromise ||= Promise.resolve(state.getArgv())
    .then((argv) => {
      const options = IpcTraceConfig.parseTraceIpc(argv)
      if (options.error) {
        reportError(new Error(options.error))
      }
      return options
    })
    .catch((error) => {
      reportError(error)
      return { error: '', selectors: new Set() }
    })
  return state.optionsPromise
}

const getWorkerId = (traceId, name, runtimeId) => {
  if (traceId) {
    return traceId
  }
  const suffix = name ? `-${name}` : ''
  return `runtime-${runtimeId}${suffix}`
}

const writeBatches = (batches) => {
  state.writeChain = state.writeChain
    .then(async () => {
      for (const [workerId, records] of batches) {
        await state.write(workerId, records)
      }
    })
    .catch(reportError)
}

export const flush = async () => {
  if (state.flushTimer !== undefined) {
    clearTimeout(state.flushTimer)
    state.flushTimer = undefined
  }
  if (state.pendingRecordCount === 0) {
    await state.writeChain
    return
  }
  const batches = state.batches
  state.batches = new Map()
  state.pendingRecordCount = 0
  writeBatches(batches)
  await state.writeChain
}

const queueRecord = (workerId, record) => {
  if (state.disabled) {
    return
  }
  let records = state.batches.get(workerId)
  if (!records) {
    records = []
    state.batches.set(workerId, records)
  }
  records.push(record)
  state.pendingRecordCount++
  if (state.pendingRecordCount >= flushRecordCount) {
    void flush()
    return
  }
  state.flushTimer ||= state.setTimeout(() => {
    state.flushTimer = undefined
    void flush()
  }, flushDelay)
}

const getData = (event) => {
  if (typeof MessageEvent !== 'undefined' && event instanceof MessageEvent) {
    return event.data
  }
  return event?.data ?? event
}

const createForwarder = (source, target, workerId, connectionId, direction, sequence) => {
  source.onmessage = (event) => {
    const message = getData(event)
    const monotonicTime = state.now()
    const startTime = monotonicTime
    let serializedMessage
    try {
      serializedMessage = state.serialize(message)
    } catch (error) {
      serializedMessage = {
        $type: 'SerializationError',
        message: error instanceof Error ? error.message : String(error),
      }
    }
    const serializationDuration = state.now() - startTime
    const transferables = state.getTransferrables(message)
    target.postMessage(message, transferables)
    queueRecord(workerId, {
      connectionId,
      direction,
      message: serializedMessage,
      monotonicTime,
      sequence: sequence.value++,
      serializationDuration,
      version: 1,
      wallTime: state.wallTime(),
      workerId,
    })
  }
  source.start?.()
}

export const maybeCreateProxy = async ({ id, name = '', port, traceId = '' }) => {
  if (!port || state.disabled) {
    return port
  }
  const options = await getOptions()
  if (state.disabled || !IpcTraceConfig.shouldTrace(options.selectors, traceId)) {
    return port
  }
  const workerId = getWorkerId(traceId, name, id)
  const connectionId = `${state.timeOrigin()}-${state.connectionId++}`
  try {
    const { port1: proxyPort, port2: workerPort } = new MessageChannel()
    const sequence = { value: 1 }
    createForwarder(port, proxyPort, workerId, connectionId, 'parent-to-worker', sequence)
    createForwarder(proxyPort, port, workerId, connectionId, 'worker-to-parent', sequence)
    return workerPort
  } catch (error) {
    reportError(error)
    return port
  }
}

export const reset = () => {
  if (state.flushTimer !== undefined) {
    clearTimeout(state.flushTimer)
  }
  state.batches = new Map()
  state.connectionId = 0
  state.disabled = false
  state.flushTimer = undefined
  state.optionsPromise = undefined
  state.pendingRecordCount = 0
  state.writeChain = Promise.resolve()
}
