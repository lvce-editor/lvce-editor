import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/PanelWorker/PanelWorker.js', () => ({
  invoke: jest.fn(async (name: string) => {
    if (name === 'Panel.getComponentState') return { uid: 13 }
    if (name === 'Panel.diff2') return []
    if (name === 'Panel.saveState') return { currentViewletId: 'Problems' }
    return undefined
  }),
  restart: jest.fn(),
}))

const PanelWorker = await import('../src/parts/PanelWorker/PanelWorker.js')
const ViewletPanel = await import('../src/parts/ViewletPanel/ViewletPanel.ipc.ts')

test('saveState lets the panel worker save its active child', async () => {
  const result = await ViewletPanel.saveState({ uid: 13 })

  expect(PanelWorker.invoke).toHaveBeenCalledWith('Panel.saveState', 13)
  expect(result).toEqual({ currentViewletId: 'Problems' })
})

test('gets and sets component state through the panel worker', async () => {
  const state = { uid: 13 }
  const result = await ViewletPanel.getComponentState(state)

  expect(PanelWorker.invoke).toHaveBeenCalledWith('Panel.getComponentState', 13)
  expect(result).toEqual({ uid: 13 })

  await ViewletPanel.setComponentState(state, { uid: 13 })
  expect(PanelWorker.invoke).toHaveBeenCalledWith('Panel.setComponentState', 13, { uid: 13 })
  expect(PanelWorker.invoke).toHaveBeenCalledWith('Panel.diff2', 13)
})

test('panel listens for workspace changes', () => {
  expect(ViewletPanel.workspaceChangeEvent).toBe('workspace.change')
})
