import { jest } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import { CancelationError } from '../src/parts/Errors/CancelationError.js'
import * as PathSeparatorType from '../src/parts/PathSeparatorType/PathSeparatorType.js'

beforeEach(() => {
  jest.resetAllMocks()
  GlobalEventBus.state.listenerMap = Object.create(null)
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

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    setState: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getState: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    rename: jest.fn(() => {
      throw new Error('not implemented')
    }),
    writeFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
    copy: jest.fn(() => {
      throw new Error('not implemented')
    }),
    remove: jest.fn(() => {
      throw new Error('not implemented')
    }),
    readDirWithFileTypes: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getPathSeparator: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getRealPath: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)

const GlobalEventBus = await import(
  '../src/parts/GlobalEventBus/GlobalEventBus.js'
)

const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

const ViewletExplorerUpdateRoot = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerUpdateRoot.js'
)

test('updateRoot - already disposed', async () => {
  const state1 = {
    ...ViewletExplorer.create(),
    disposed: true,
  }
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    return state1
  })

  expect(await ViewletExplorerUpdateRoot.updateRoot()).toBe(state1)
})

test('updateRoot - disposed after reading files', async () => {
  const state1 = {
    ...ViewletExplorer.create(),
  }
  const state2 = {
    ...state1,
    disposed: true,
  }
  let i = 0
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    switch (++i) {
      case 1:
        return state1
      case 2:
        return state2
      default:
        throw new Error(`unexpected state ${i}`)
    }
  })
  expect(await ViewletExplorerUpdateRoot.updateRoot()).toBe(state2)
})

test('updateRoot - root changes while reading directories', async () => {
  const state1 = {
    ...ViewletExplorer.create(),
    root: '/test-1',
  }
  const state2 = {
    ...state1,
    root: '/test-2',
  }
  let i = 0
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    switch (++i) {
      case 1:
        return state1
      case 2:
        return state2
      default:
        throw new Error(`unexpected state ${i}`)
    }
  })
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [
      {
        name: 'folder-1',
        type: DirentType.Directory,
      },
    ]
  })
  expect(await ViewletExplorerUpdateRoot.updateRoot()).toBe(state2)
})

test('updateRoot - new folder', async () => {
  const state1 = {
    ...ViewletExplorer.create(),
    root: '/test',
  }
  const state2 = {
    ...state1,
  }
  let i = 0
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    switch (++i) {
      case 1:
        return state1
      case 2:
        return state2
      default:
        throw new Error(`unexpected state ${i}`)
    }
  })
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [
      {
        name: 'folder-1',
        type: DirentType.Directory,
      },
    ]
  })
  expect(await ViewletExplorerUpdateRoot.updateRoot()).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
    ],
  })
})
