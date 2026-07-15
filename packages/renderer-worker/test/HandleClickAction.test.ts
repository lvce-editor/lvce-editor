import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(async () => {}),
  }
})

const HandleClickAction = await import('../src/parts/HandleClickAction/HandleClickAction.js')
const Command = await import('../src/parts/Command/Command.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('handleClickAction prefixes built-in viewlet actions', async () => {
  const state = {
    currentViewletId: 'Explorer',
  }

  await HandleClickAction.handleClickAction(state, 0, 'refresh')

  expect(Command.execute).toHaveBeenCalledWith('Explorer.refresh')
})

test('handleClickAction executes extension view action commands directly', async () => {
  const state = {
    currentViewletId: 'trello.views.boards',
  }

  await HandleClickAction.handleClickAction(state, 0, 'trello.refreshBoards')

  expect(Command.execute).toHaveBeenCalledWith('ExtensionHost.executeCommand', 'trello.refreshBoards')
})
