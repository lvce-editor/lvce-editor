import { expect, test } from '@jest/globals'
import { createBundledWorkerConstructor } from '../src/parts/BundledWorkerRuntime/BundledWorkerRuntime.ts'

const host = {
  AbortController,
  AbortSignal,
  cancelAnimationFrame: clearTimeout,
  clearInterval,
  clearTimeout,
  ErrorEvent: class extends Event {
    constructor(type: string, options: any) {
      super(type)
      Object.assign(this, options)
    }
  },
  EventTarget,
  location: { href: 'https://example.test/prefix/index.html' },
  MessageChannel,
  MessageEvent,
  requestAnimationFrame: (callback: any): any => setTimeout(callback, 1),
  setInterval,
  setTimeout,
  Worker: class {
    constructor(
      public url: string,
      public options: any,
    ) {}
  },
}

const next = (target: any, type = 'message'): Promise<any> =>
  new Promise((resolve) => {
    target.addEventListener(type, resolve, { once: true })
  })

test('private factories route commands independently with asynchronous structured cloning', async () => {
  const factory = async (scope: any): Promise<void> => {
    let count = 0
    scope.addEventListener('message', (event: any) => scope.postMessage({ count: ++count, value: event.data.value }))
    scope.postMessage('ready')
  }
  const Worker = createBundledWorkerConstructor({ 'https://example.test/prefix/worker.js': factory }, host)
  const first = new Worker('./worker.js', { type: 'module' })
  const second = new Worker('./worker.js', { type: 'module' })
  try {
    expect((await next(first)).data).toBe('ready')
    expect((await next(second)).data).toBe('ready')
    const message = { value: 1 }
    const replies = Promise.all([next(first), next(second)])
    first.postMessage(message)
    second.postMessage({ value: 2 })
    message.value = 99
    expect((await replies).map((event) => event.data)).toEqual([
      { count: 1, value: 1 },
      { count: 1, value: 2 },
    ])
  } finally {
    first.terminate()
    second.terminate()
  }
})

test('transfers a real message port to an independent endpoint', async () => {
  const Worker = createBundledWorkerConstructor(
    {
      'https://example.test/worker.js': async (scope: any) => {
        scope.addEventListener('message', (event: any) => event.data.port.postMessage('through transferred port'))
      },
    },
    host,
  )
  const worker = new Worker('/worker.js', { type: 'module' })
  const { port1, port2 } = new MessageChannel()
  try {
    const reply = next(port1)
    port1.start()
    worker.postMessage({ port: port2 }, [port2])
    expect((await reply).data).toBe('through transferred port')
  } finally {
    worker.terminate()
    port1.close()
    port2.close()
  }
})

test('startup rejection emits error and cancels owned resources', async () => {
  let ticked = false
  const Worker = createBundledWorkerConstructor(
    {
      'https://example.test/fail.js': async (scope: any) => {
        scope.setTimeout(() => {
          ticked = true
        }, 20)
        throw new Error('startup failed')
      },
    },
    host,
  )
  const worker = new Worker('/fail.js', { type: 'module' })
  const event = await next(worker, 'error')
  expect(event.message).toContain('startup failed')
  expect(worker.stopped).toBe(true)
  await new Promise((resolve) => setTimeout(resolve, 30))
  expect(ticked).toBe(false)
  expect(worker.ports.size).toBe(0)
  worker.terminate()
})

test('unlisted extension workers retain native workers', () => {
  const Worker = createBundledWorkerConstructor({}, host)
  const options = { name: 'extension', type: 'module' }
  const worker = new Worker('/extension.js', options)
  expect(worker).toBeInstanceOf(host.Worker)
  expect(worker.url).toBe('/extension.js')
  expect(worker.options).toBe(options)
  expect(worker).toBeInstanceOf(Worker)
})

test('termination prevents queued startup and cancels independent animation and timer identifiers', async () => {
  let startup = false
  const cancelled: string[] = []
  const timerHost = {
    ...host,
    cancelAnimationFrame: (): void => {
      cancelled.push('frame')
    },
    clearTimeout: (): void => {
      cancelled.push('timer')
    },
    requestAnimationFrame: (): number => 1,
    setTimeout: (): number => 1,
  }
  const Worker = createBundledWorkerConstructor(
    {
      'https://example.test/worker.js': async (scope: any) => {
        startup = true
        scope.setTimeout(() => {}, 20)
        scope.requestAnimationFrame(() => {})
        scope.postMessage('ready')
      },
    },
    timerHost,
  )
  const cancelledWorker = new Worker('/worker.js', { type: 'module' })
  cancelledWorker.terminate()
  await Promise.resolve()
  expect(startup).toBe(false)
  const worker = new Worker('/worker.js', { type: 'module' })
  await next(worker)
  worker.terminate()
  expect(cancelled.sort()).toEqual(['frame', 'timer'])
})

test('termination aborts fetch and late startup cannot retain new resources', async () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  let signal: AbortSignal | undefined
  let lateScope: any
  const Worker = createBundledWorkerConstructor(
    {
      'https://example.test/worker.js': async (scope: any) => {
        lateScope = scope
        scope.fetch('/resource')
        scope.postMessage('ready')
        await promise
        scope.setTimeout(() => {}, 1)
        new scope.MessageChannel()
      },
    },
    {
      ...host,
      fetch: (_url: any, options: any): Promise<any> => {
        signal = options.signal
        return Promise.resolve({})
      },
    },
  )
  const worker = new Worker('/worker.js', { type: 'module' })
  await next(worker)
  worker.terminate()
  expect(signal?.aborted).toBe(true)
  resolve()
  await Promise.resolve()
  expect(worker.ports.size).toBe(0)
  expect(worker.timers.size).toBe(0)
  expect(lateScope.globalThis).toBe(lateScope.self)
})

test('closed and transferred ports do not accumulate in a long-lived worker', async () => {
  const Worker = createBundledWorkerConstructor(
    {
      'https://example.test/worker.js': async (scope: any) => {
        for (let i = 0; i < 20; i++) {
          const channel = new scope.MessageChannel()
          channel.port1.close()
          scope.postMessage({ port: channel.port2 }, [channel.port2])
        }
        scope.postMessage('ready')
      },
    },
    host,
  )
  const worker = new Worker('/worker.js', { type: 'module' })
  try {
    await new Promise<void>((resolve) => {
      worker.onmessage = (event: any): void => {
        if (event.data === 'ready') resolve()
        else event.data.port.close()
      }
    })
    expect(worker.ports.size).toBe(2)
  } finally {
    worker.terminate()
  }
})


test('configuration query parameters select the bundled factory and remain in worker location', async () => {
  const Worker = createBundledWorkerConstructor(
    {
      'https://example.test/prefix/worker.js': async (scope: any): Promise<void> => {
        scope.postMessage(scope.location.href)
      },
    },
    host,
  )
  const worker = new Worker('./worker.js?config=%7B%22platform%22%3A%22web%22%7D#startup', { type: 'module' })
  try {
    expect((await next(worker)).data).toBe('https://example.test/prefix/worker.js?config=%7B%22platform%22%3A%22web%22%7D#startup')
  } finally {
    worker.terminate()
  }
})
