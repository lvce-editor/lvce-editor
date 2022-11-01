import { jest } from '@jest/globals'
import * as Callback from '../src/parts/Callback/Callback.js'
import * as LifeCycle from '../src/parts/LifeCycle/LifeCycle.js'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'

beforeEach(() => {
  jest.resetAllMocks()
  Callback.state.id = 0
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Download/Download.js', () => {
  return {
    downloadJson: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    getAllStates: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule(
  '../src/parts/ElectronWindow/ElectronWindow.js',
  () => {
    return {
      toggleDevtools: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: 'remote',
    getLogsDir: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getConfigPath: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule(
  '../src/parts/ProcessExplorer/ProcessExplorer.js',
  () => {
    return {
      open: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const Platform = await import('../src/parts/Platform/Platform.js')
const ProcessExplorer = await import(
  '../src/parts/ProcessExplorer/ProcessExplorer.js'
)

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)
const ElectronWindow = await import(
  '../src/parts/ElectronWindow/ElectronWindow.js'
)
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const Download = await import('../src/parts/Download/Download.js')

const Developer = await import('../src/parts/Developer/Developer.js')

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
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 200:
        return {
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
        }
      case 8309:
        return {
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
        }
      default:
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
  // @ts-ignore
  delete globalThis.performance
})

test.skip('monitorPerformance', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 284:
        return {
          rss: 60567552,
          heapTotal: 11350016,
          heapUsed: 8160336,
          external: 1654987,
          arrayBuffers: 85610,
        }
      case 393:
        return {
          rss: 60567552,
          heapTotal: 11350016,
          heapUsed: 8160336,
          external: 1654987,
          arrayBuffers: 85610,
        }
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return {
      jsHeapSizeLimit: 2172649472,
      totalJSHeapSize: 2822704,
      usedJSHeapSize: 2400652,
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
  expect(SharedProcess.invoke).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    method: 284,
    params: [],
    id: 1,
  })
  expect(RendererProcess.invoke).toHaveBeenCalledWith([
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
  // @ts-ignore
  delete globalThis.performance
})

// TODO test crashSharedProcess error

test('crashSharedProcess', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await Developer.crashSharedProcess()
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'Developer.crashSharedProcess'
  )
})

// TODO test createSharedProcessHeapSnapshot error

test('createSharedProcessHeapSnapshot', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'Developer.createSharedProcessHeapSnapshot':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await Developer.createSharedProcessHeapSnapshot()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'Developer.createSharedProcessHeapSnapshot'
  )
})

// TODO test toggleDeveloperTools error

test('toggleDeveloperTools', async () => {
  // @ts-ignore
  ElectronWindow.toggleDevtools.mockImplementation(() => {})
  await Developer.toggleDeveloperTools()
  expect(ElectronWindow.toggleDevtools).toHaveBeenCalledTimes(1)
})

// TODO test openConfigFolder error

test('openConfigFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'Native.openFolder':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  Platform.getConfigPath.mockImplementation(() => {
    return '/test/config-folder'
  })
  await Developer.openConfigFolder()
  expect(SharedProcess.invoke).toHaveBeenLastCalledWith(
    'Native.openFolder',
    '/test/config-folder'
  )
})

test('openDataFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'Native.openFolder':
        return null
      case 'Platform.getDataDir':
        return '/test/data-folder'
      default:
        throw new Error('unexpected message')
    }
  })
  await Developer.openDataFolder()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(2)
  expect(SharedProcess.invoke).toHaveBeenLastCalledWith(
    'Native.openFolder',
    '/test/data-folder'
  )
})

test('openLogsFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'Native.openFolder':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  Platform.getLogsDir.mockImplementation(() => {
    return '~/.local/state/app-name'
  })
  await Developer.openLogsFolder()
  expect(SharedProcess.invoke).toHaveBeenLastCalledWith(
    'Native.openFolder',
    '~/.local/state/app-name'
  )
})

test('openLogsFolder - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'Native.openFolder':
        return null
      case 'Platform.getLogsDir':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  Platform.getLogsDir.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(Developer.openLogsFolder()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('open process explorer', async () => {
  // @ts-ignore
  ProcessExplorer.open.mockImplementation(() => {})
  await Developer.openProcessExplorer()
  expect(ProcessExplorer.open).toHaveBeenCalledTimes(1)
})

test('open process explorer - error', async () => {
  // @ts-ignore
  ProcessExplorer.open.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(Developer.openProcessExplorer()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('getAllStates', async () => {
  // @ts-ignore
  Viewlet.getAllStates.mockImplementation(() => {
    return {
      Explorer: {
        state: {
          root: '/test',
        },
      },
    }
  })
  // @ts-ignore
  Download.downloadJson.mockImplementation(() => {})
  await Developer.downloadViewletState()
  expect(Download.downloadJson).toHaveBeenCalledTimes(1)
  expect(Download.downloadJson).toHaveBeenCalledWith(
    { Explorer: { state: { root: '/test' } } },
    'viewlets.json'
  )
})
