import { beforeEach, expect, jest, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ContextMenu/ContextMenu.js', () => {
  return {
    show: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ContextMenu = await import('../src/parts/ContextMenu/ContextMenu.js')
const ViewletExplorerHandleContextMenuKeyboard = await import('../src/parts/ViewletExplorer/ViewletExplorerHandleContextMenuKeyboard.js')
const ViewletExplorer = await import('../src/parts/ViewletExplorer/ViewletExplorer.js')

test('handleContextMenuKeyboard', async () => {
  const state = {
    ...ViewletExplorer.create(1),
    focusedIndex: 2,
    x: 10,
    y: 20,
    itemHeight: 20,
    items: [
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
  ContextMenu.show.mockImplementation(() => {})
  expect(await ViewletExplorerHandleContextMenuKeyboard.handleContextMenuKeyboard(state)).toMatchObject({
    focusedIndex: 2,
  })
  expect(ContextMenu.show).toHaveBeenCalledTimes(1)
  expect(ContextMenu.show).toHaveBeenCalledWith(10, 80, MenuEntryId.Explorer)
})
