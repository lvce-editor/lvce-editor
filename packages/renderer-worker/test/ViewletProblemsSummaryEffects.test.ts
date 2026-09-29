import { beforeEach, expect, jest, test } from '@jest/globals'

const execute = jest.fn<(command: string) => Promise<undefined>>(async () => undefined)

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute }))

const ViewletPanel = await import('../src/parts/ViewletPanel/ViewletPanel.ipc.ts')
const ViewletStatusBar = await import('../src/parts/ViewletStatusBar/ViewletStatusBar.ipc.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('refreshes the problems summary when the panel loads', async () => {
  await ViewletPanel.contentLoadedEffects()

  expect(execute).toHaveBeenCalledWith('Layout.refreshProblemsSummary')
})

test('refreshes the problems summary when the status bar loads', async () => {
  await ViewletStatusBar.contentLoadedEffects()

  expect(execute).toHaveBeenCalledWith('Layout.refreshProblemsSummary')
})
