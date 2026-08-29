import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

const Command = await import('../src/parts/Command/Command.js')
const ViewletSimpleBrowserOpenHistory = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserOpenHistory.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('opens history in the main area', async () => {
  const state = { uid: 12 }

  await expect(ViewletSimpleBrowserOpenHistory.openHistory(state)).resolves.toBe(state)
  expect(Command.execute).toHaveBeenCalledWith('Main.openUri', 'simple-browser-history://')
})
