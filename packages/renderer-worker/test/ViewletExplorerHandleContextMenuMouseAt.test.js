import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Command = await import('../src/parts/Command/Command.js')
const ViewletExplorerHandleContextMenuMouseAt = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerHandleContextMenuMouseAt.js'
)
const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)

test('handleContextMenuMouse', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: -1,
    top: 0,
  }
  expect(
    await ViewletExplorerHandleContextMenuMouseAt.handleContextMenuMouseAt(
      state,
      /* x */ 0,
      /* y */ 100
    )
  ).toMatchObject({
    focusedIndex: -1,
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'ContextMenu.show',
    0,
    100,
    MenuEntryId.Explorer
  )
})

test('event - issue with blur event after context menu event', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: '/',
    focusedIndex: 2,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  const state2 =
    await ViewletExplorerHandleContextMenuMouseAt.handleContextMenuMouseAt(
      state,
      0,
      0
    )
  const state3 = await ViewletExplorer.handleBlur(state2)
  expect(state3).toMatchObject({ focusedIndex: 0, focused: false })
})
