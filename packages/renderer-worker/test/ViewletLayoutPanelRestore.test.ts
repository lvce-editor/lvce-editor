import { expect, test } from '@jest/globals'

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')
const ViewletModuleId = await import('../src/parts/ViewletModuleId/ViewletModuleId.js')

const restoreLayout = (savedState) => {
  return ViewletLayout.loadContent(ViewletLayout.create(1), {
    ...savedState,
    Layout: {
      bounds: {
        windowHeight: 800,
        windowWidth: 1200,
      },
    },
  })
}

test('restores the selected panel view after reload', () => {
  const state = {
    ...ViewletLayout.create(1),
    panelView: ViewletModuleId.Terminals,
  }

  const savedState = ViewletLayout.saveState(state)
  const restoredState = restoreLayout(savedState)

  expect(savedState.panelView).toBe(ViewletModuleId.Terminals)
  expect(restoredState.panelView).toBe(ViewletModuleId.Terminals)
})

test('defaults to Problems when restoring state without a panel view', () => {
  const restoredState = restoreLayout({})

  expect(restoredState.panelView).toBe(ViewletModuleId.Problems)
})
