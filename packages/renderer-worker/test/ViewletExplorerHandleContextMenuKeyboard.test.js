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
const ViewletExplorerHandleContextMenuKeyboard = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerHandleContextMenuKeyboard.js'
)
const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)

test('handleContextMenuKeyboard', async () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 2,
    left: 10,
    top: 20,
    itemHeight: 20,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'file 1',
        path: 'file 1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: 'file 2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 3',
        path: 'file 3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
    ],
  }
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  expect(
    await ViewletExplorerHandleContextMenuKeyboard.handleContextMenuKeyboard(
      state
    )
  ).toMatchObject({
    focusedIndex: 2,
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'ContextMenu.show',
    10,
    80,
    MenuEntryId.Explorer
  )
})
