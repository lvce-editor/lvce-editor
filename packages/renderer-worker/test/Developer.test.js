import { jest } from '@jest/globals'
import * as Callback from '../src/parts/Callback/Callback.js'
import * as Developer from '../src/parts/Developer/Developer.js'
import * as LifeCycle from '../src/parts/LifeCycle/LifeCycle.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

beforeEach(() => {
  Callback.state.id = 0
})

// // TODO maybe put toMarkdownTable into another file (not sure where since it is only used in Developer.js currently)
// test('toMarkdownTable', () => {
//   expect(
//     Developer.toMarkdownTable(
//       ['Name', 'Duration'],
//       [
//         ['code/openWorkspace', '14.50ms'],
//         ['code/loadMain', '48.20ms'],
//         ['code/loadSideBar', '15.20ms'],
//         ['code/showWorkbench', '6.50ms'],
//         ['code/loadPanel', '26.90ms'],
//         ['code/loadActivityBar', '19.30ms'],
//       ]
//     )
//   ).toEqual(
//     `
// | Name                 | Duration |
// |----------------------|----------|
// | code/openWorkspace   | 14.50ms  |
// | code/loadMain        | 48.20ms  |
// | code/loadSideBar     | 15.20ms  |
// | code/showWorkbench   | 6.50ms   |
// | code/loadPanel       | 26.90ms  |
// | code/loadActivityBar | 19.30ms  |
// `.trimStart()
//   )
// })

// TODO test error handling when electron result has invalid shape like
// {
//   entries: [ {}, {}, {}, {}, {}, {} ],
//   timeOrigin: 1646733234418.877
// }
// it should still show the other entries and show n/a for electron entries
// and possibly log an error to the console

test.skip('startupPerformance', async () => {
  LifeCycle.state.phase = LifeCycle.PHASE_TWELVE
  RendererProcess.state.send = jest.fn()
  SharedProcess.state.send = jest.fn((message) => {
    if (message.method === 289) {
      SharedProcess.state.receive({
        id: message.id,
        jsonrpc: '2.0',
        result: {
          name: 'node',
          entryType: 'node',
          startTime: 0,
          duration: 1427.8611280000769,
          nodeStart: 0.1311999997124076,
          v8Start: 0.742397999856621,
          bootstrapComplete: 25.16905999975279,
          environment: 11.306466999929398,
          loopStart: 30.154075999744236,
          loopExit: -1,
          idleTime: 1218.696944,
        },
      })
    } else if (message.method === 8309) {
      SharedProcess.state.receive({
        id: message.id,
        jsonrpc: '2.0',
        result: {
          entries: [
            {
              name: 'code/appReady',
              entryType: 'mark',
              startTime: 277.44424299895763,
              duration: 0,
              detail: null,
            },
            {
              name: 'code/serverReady',
              entryType: 'mark',
              startTime: 337.72121299803257,
              duration: 0,
              detail: null,
            },
          ],
          timeOrigin: 1639505170123.671,
        },
      })
    } else {
      console.log(message)
      throw new Error('unexpected message')
    }
  })
  globalThis.performance = {
    // @ts-ignore
    getEntriesByType: jest.fn(() => [
      {
        name: 'loadMain',
        startTime: 11.12345,
        duration: 22.12345,
      },
    ]),
    timeOrigin: 1639505170333.671,
  }
  // @ts-ignore
  globalThis.PerformanceObserver = class {
    observe() {}
    takeRecords() {
      return []
    }

    disconnect() {}
  }
  await Developer.getStartupPerformanceContent()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    2134,
    expect.any(Number),
    'perf://Startup Performance',
    'markdown',
    {
      id: expect.any(Number),
      lines: `# Startup Performance

## main-process

| Name             | Start Time | Duration |
|------------------|------------|----------|
| code/appReady    | 277.44ms   | 0.00ms   |
| code/serverReady | 337.72ms   | 0.00ms   |


## renderer-worker (+210.00ms)

| Name     | Start Time | Duration |
|----------|------------|----------|
| loadMain | 221.12ms   | 22.12ms  |


## Web Vitals

| Name                   | Start Time |
|------------------------|------------|
| first-paint            | -1.00ms    |
| firstContentfulPaint   | -1.00ms    |
| largestContentfulPaint | -1.00ms    |


## Node Startup Timing

| Name              | Value     |
|-------------------|-----------|
| name              | node      |
| entryType         | node      |
| startTime         | 0         |
| duration          | 1427.86ms |
| nodeStart         | 0.13ms    |
| v8Start           | 0.74ms    |
| bootstrapComplete | 25.17ms   |
| environment       | 11.31ms   |
| loopStart         | 30.15ms   |
| loopExit          | -1        |
| idleTime          | 1218.70ms |


## Extension Host
`.split('\n'),
    },
  ])
  delete globalThis.performance
})

test.skip('monitorPerformance', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 284:
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: {
            rss: 60567552,
            heapTotal: 11350016,
            heapUsed: 8160336,
            external: 1654987,
            arrayBuffers: 85610,
          },
        })
        break
      case 393:
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: {
            rss: 60567552,
            heapTotal: 11350016,
            heapUsed: 8160336,
            external: 1654987,
            arrayBuffers: 85610,
          },
        })
        break
      default:
        break
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    if (message[0] === 909090 && message[2] === 284) {
      RendererProcess.state.handleMessage([
        67330,
        message[1],
        {
          jsHeapSizeLimit: 2172649472,
          totalJSHeapSize: 2822704,
          usedJSHeapSize: 2400652,
        },
      ])
    }
  })
  globalThis.performance = {
    // @ts-ignore
    memory: {
      jsHeapSizeLimit: 2172649472,
      totalJSHeapSize: 2822704,
      usedJSHeapSize: 2400652,
    },
  }
  SharedProcess.state.totalSent = 379
  SharedProcess.state.totalReceived = 1693
  await Developer.getMemoryUsageContent()
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 284,
    params: [],
    id: 1,
  })
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    2134,
    expect.any(Number),
    'perf://Monitor Performance',
    'unknown',
    {
      id: expect.any(Number),
      lines: `## Shared Process

| Name         | Memory  |
|--------------|---------|
| rss          | 60.6 MB |
| heapTotal    | 11.4 MB |
| heapUsed     | 8.16 MB |
| external     | 1.65 MB |
| arrayBuffers | 85.6 kB |


## Extension Host

| Name         | Memory  |
|--------------|---------|
| rss          | 60.6 MB |
| heapTotal    | 11.4 MB |
| heapUsed     | 8.16 MB |
| external     | 1.65 MB |
| arrayBuffers | 85.6 kB |


## Renderer Worker / Renderer Process

| Name              | Value   |
|-------------------|---------|
| jsHeapSizeLimit   | 2.17 GB |
| Total JS HeapSize | 2.82 MB |
| Used JS HeapSize  | 2.4 MB  |
| Sent              | 379 B   |
| Received          | 1.69 kB |

`.split('\n'),
    },
  ])
  delete globalThis.performance
})

// TODO test crashSharedProcess error

test('crashSharedProcess', () => {
  SharedProcess.state.send = jest.fn()
  Developer.crashSharedProcess()
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 'Developer.crashSharedProcess',
    params: [],
  })
})

// TODO test createSharedProcessHeapSnapshot error

test('createSharedProcessHeapSnapshot', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Developer.createSharedProcessHeapSnapshot':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: 1,
        })
        break
      default:
        break
    }
  })
  await Developer.createSharedProcessHeapSnapshot()
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: 1,
    jsonrpc: '2.0',
    method: 'Developer.createSharedProcessHeapSnapshot',
    params: [],
  })
})

// TODO test toggleDeveloperTools error

test('toggleDeveloperTools', () => {
  SharedProcess.state.send = jest.fn()
  Developer.toggleDeveloperTools()
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 'Electron.toggleDevtools',
    params: [],
  })
})

// TODO test openConfigFolder error

test('openConfigFolder', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Native.openFolder':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      case 'Platform.getConfigDir':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: '/test/config-folder',
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await Developer.openConfigFolder()
  expect(SharedProcess.state.send).toHaveBeenLastCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'Native.openFolder',
    params: ['/test/config-folder'],
  })
})

test('openDataFolder', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Native.openFolder':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      case 'Platform.getDataDir':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: '/test/data-folder',
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await Developer.openDataFolder()
  expect(SharedProcess.state.send).toHaveBeenLastCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'Native.openFolder',
    params: ['/test/data-folder'],
  })
})

test('openLogsFolder', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Native.openFolder':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      case 'Platform.getLogsDir':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: '~/.local/state/app-name',
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await Developer.openLogsFolder()
  expect(SharedProcess.state.send).toHaveBeenLastCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'Native.openFolder',
    params: ['~/.local/state/app-name'],
  })
})

test('openLogsFolder - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Native.openFolder':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      case 'Platform.getLogsDir':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await expect(Developer.openLogsFolder()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('open process explorer', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Electron.openProcessExplorer':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await Developer.openProcessExplorer()
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(1)
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'Electron.openProcessExplorer',
    params: [],
  })
})

test('open process explorer - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Electron.openProcessExplorer':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(Developer.openProcessExplorer()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})
