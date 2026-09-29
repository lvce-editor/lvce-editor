import { beforeEach, expect, jest, test } from '@jest/globals'

class FakeMessagePort {
  onmessage: ((event: { data: unknown }) => void) | undefined
  other: FakeMessagePort | undefined
  transfers: readonly (readonly unknown[])[] = []

  postMessage(message: unknown, transferables: readonly unknown[] = []): void {
    this.transfers = [...this.transfers, transferables]
    this.other?.onmessage?.({ data: message })
  }

  start(): void {}
}

class FakeMessageChannel {
  port1 = new FakeMessagePort()
  port2 = new FakeMessagePort()

  constructor() {
    this.port1.other = this.port2
    this.port2.other = this.port1
  }
}

// @ts-ignore
globalThis.MessageChannel = FakeMessageChannel

const IpcTrace = await import('../src/parts/IpcTrace/IpcTrace.js')

beforeEach(async () => {
  IpcTrace.reset()
  IpcTrace.state.getArgv = jest.fn(async () => ['/usr/bin/lvce', '--trace-ipc=builtin.eslint'])
  IpcTrace.state.getTransferrables = jest.fn(() => [])
  IpcTrace.state.now = jest.fn(() => 12)
  IpcTrace.state.serialize = jest.fn((value) => value)
  IpcTrace.state.timeOrigin = jest.fn(() => 100)
  IpcTrace.state.wallTime = jest.fn(() => '2026-08-15T21:55:00.000Z')
  IpcTrace.state.write = jest.fn(async () => undefined)
  IpcTrace.state.writeStderr = jest.fn(async () => undefined)
  await IpcTrace.initialize()
})

test('does not request trace configuration while creating a worker proxy', async () => {
  IpcTrace.reset()
  const getArgv = jest.fn(async () => ['/usr/bin/lvce', '--trace-ipc=builtin.eslint'])
  IpcTrace.state.getArgv = getArgv
  const parentChannel = new FakeMessageChannel()

  const port = await IpcTrace.maybeCreateProxy({
    id: 42,
    name: 'ESLint Worker',
    port: parentChannel.port2,
    traceId: 'builtin.eslint',
  })

  expect(port).toBe(parentChannel.port2)
  expect(getArgv).not.toHaveBeenCalled()
})

test('forwards selected worker messages in both directions and records them', async () => {
  const parentChannel = new FakeMessageChannel()
  const workerPort = (await IpcTrace.maybeCreateProxy({
    id: 42,
    name: 'ESLint Worker',
    port: parentChannel.port2,
    traceId: 'builtin.eslint',
  })) as unknown as FakeMessagePort
  const receivedByWorker: unknown[] = []
  const receivedByParent: unknown[] = []
  workerPort.onmessage = (event) => receivedByWorker.push(event.data)
  parentChannel.port1.onmessage = (event) => receivedByParent.push(event.data)

  parentChannel.port1.postMessage({ method: 'Lint.lint' })
  workerPort.postMessage({ result: [] })
  await IpcTrace.flush()

  expect(receivedByWorker).toEqual([{ method: 'Lint.lint' }])
  expect(receivedByParent).toEqual([{ result: [] }])
  expect(IpcTrace.state.write).toHaveBeenCalledWith(
    'builtin.eslint',
    expect.arrayContaining([
      expect.objectContaining({
        direction: 'parent-to-worker',
        sequence: 1,
        workerId: 'builtin.eslint',
      }),
      expect.objectContaining({
        direction: 'worker-to-parent',
        sequence: 2,
        workerId: 'builtin.eslint',
      }),
    ]),
  )
})

test('keeps unselected workers on the direct port path', async () => {
  const parentChannel = new FakeMessageChannel()
  const port = await IpcTrace.maybeCreateProxy({
    id: 42,
    name: 'Other Worker',
    port: parentChannel.port2,
    traceId: 'builtin.other',
  })
  expect(port).toBe(parentChannel.port2)
  expect(IpcTrace.state.write).not.toHaveBeenCalled()
})

test('disables tracing after a writer failure without breaking forwarding', async () => {
  IpcTrace.state.write = jest.fn(async () => {
    throw new Error('disk full')
  })
  const parentChannel = new FakeMessageChannel()
  const workerPort = (await IpcTrace.maybeCreateProxy({
    id: 42,
    name: 'ESLint Worker',
    port: parentChannel.port2,
    traceId: 'builtin.eslint',
  })) as unknown as FakeMessagePort
  const received: unknown[] = []
  workerPort.onmessage = (event) => received.push(event.data)

  parentChannel.port1.postMessage({ method: 'Lint.lint' })
  await IpcTrace.flush()
  parentChannel.port1.postMessage({ method: 'Lint.lintAgain' })

  expect(IpcTrace.state.disabled).toBe(true)
  expect(received).toEqual([{ method: 'Lint.lint' }, { method: 'Lint.lintAgain' }])
})
