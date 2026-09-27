import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.panel-drag-reveal'

export const test: Test = async ({ Command, Locator, expect }) => {
  await Command.execute('Layout.handleResize', 1280, 720)

  const panel = Locator('.WorkbenchMain .Panel')
  const statusBar = Locator('.WorkbenchMain .StatusBar')
  const problemsTab = Locator('.PanelTab[name="Problems"]')
  const terminalsTab = Locator('.PanelTab[name="Terminals"]')
  const referenceNodeError = Locator('text="Reference node not found"')

  const dragPanelSash = async (y: number) => {
    await Command.execute('Layout.handleSashPointerDown', 'Panel')
    await Command.execute('Layout.handleSashPointerMove', 0, y)
  }

  await dragPanelSash(500)
  await expect(panel).toBeVisible()
  await expect(statusBar).toBeVisible()
  await expect(problemsTab).toBeVisible()
  await expect(referenceNodeError).toHaveCount(0)

  await dragPanelSash(710)
  await expect(panel).toHaveCount(0)

  await dragPanelSash(500)
  await expect(panel).toBeVisible()
  await expect(statusBar).toBeVisible()
  await expect(problemsTab).toBeVisible()
  await expect(referenceNodeError).toHaveCount(0)

  await Command.execute('Layout.showPanel', 'Terminals')
  await expect(terminalsTab).toBeVisible()
  await dragPanelSash(710)
  await expect(panel).toHaveCount(0)
  await dragPanelSash(500)
  await expect(panel).toBeVisible()
  await expect(terminalsTab).toBeVisible()
  await expect(referenceNodeError).toHaveCount(0)
}
