import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/PanelWorker/PanelWorker.js', () => ({
  invoke: jest.fn(async () => ({ currentViewletId: 'Problems' })),
  restart: jest.fn(),
}))

const PanelWorker = await import('../src/parts/PanelWorker/PanelWorker.js')
const ViewletPanel = await import('../src/parts/ViewletPanel/ViewletPanel.ts')

test('saveState lets the panel worker save its active child', async () => {
  const result = await ViewletPanel.saveState({ uid: 13 })

  expect(PanelWorker.invoke).toHaveBeenCalledWith('Panel.saveState', 13)
  expect(result).toEqual({ currentViewletId: 'Problems' })
})
