import { jest } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'

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

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

const Workspace = await import('../src/parts/Workspace/Workspace.js')

const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)
const ViewletExplorerHandlePaste = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerHandlePaste.js'
)

const GlobalEventBus = await import(
  '../src/parts/GlobalEventBus/GlobalEventBus.js'
)

const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')

const Command = await import('../src/parts/Command/Command.js')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

test('handlePaste - copied gnome files', async () => {
  const state1 = {
    ...ViewletExplorer.create('', 0, 0, 0, 0),
    root: '/test',
  }
  let i = 0
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    switch (++i) {
      case 1:
      case 2:
      case 3:
        return state1
      default:
        throw new Error(`unexpected state ${i}`)
    }
  })
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [
      {
        name: 'some-file.txt',
        type: DirentType.File,
      },
    ]
  })
  // @ts-ignore
  FileSystem.copy.mockImplementation(() => {})
  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ClipBoard.readNativeFiles':
        return {
          source: 'gnomeCopiedFiles',
          type: 'copy',
          files: ['/test/some-file.txt'],
        }
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  expect(await ViewletExplorerHandlePaste.handlePaste(state1)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'some-file.txt',
        path: '/test/some-file.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
})

test('handlePaste - cut gnome files', async () => {
  const state = ViewletExplorer.create('', 0, 0, 0, 0)
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ClipBoard.readNativeFiles':
        return {
          source: 'gnomeCopiedFiles',
          type: 'cut',
          files: ['/test/some-file.txt'],
        }
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExplorerHandlePaste.handlePaste(state)
})

test('handlePaste - not supported', async () => {
  const state = ViewletExplorer.create('', 0, 0, 0, 0)
  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ClipBoard.readNativeFiles':
        return {
          source: 'notSupported',
          type: 'none',
          files: [],
        }
      default:
        throw new Error(`unexpected message ${method}`)
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const spy = jest.spyOn(console, 'info').mockImplementation(() => {})
  await ViewletExplorerHandlePaste.handlePaste(state)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    '[ViewletExplorer/handlePaste] no paths detected'
  )
})

test('handlePaste - unexpected result', async () => {
  const state = ViewletExplorer.create('', 0, 0, 0, 0)
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    throw new Error('unexpected native paste type: non-existing')
  })
  await expect(
    ViewletExplorerHandlePaste.handlePaste(state)
  ).rejects.toThrowError(
    new Error('unexpected native paste type: non-existing')
  )
})
