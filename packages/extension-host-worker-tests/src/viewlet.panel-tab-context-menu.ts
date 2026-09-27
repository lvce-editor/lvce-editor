import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.panel-tab-context-menu'

export const test: Test = async ({ Command, ContextMenu, Locator, expect }) => {
  await Command.execute('Layout.showPanel', 'Problems')

  const problemsTab = Locator('.PanelTab[name="Problems"]')
  const outputTab = Locator('.PanelTab[name="Output"]')

  await expect(problemsTab).toBeVisible()
  await expect(outputTab).toBeVisible()

  // eslint-disable-next-line e2e/no-direct-click -- Playwright's supported button option issues the tab contextmenu event
  await problemsTab.click({ button: 'right' })
  await expect(Locator('.MenuItem')).toHaveCount(6)
  await ContextMenu.selectItem('Output')
  await expect(outputTab).toHaveCount(0)

  // eslint-disable-next-line e2e/no-direct-click -- Playwright's supported button option issues the tab contextmenu event
  await problemsTab.click({ button: 'right' })
  await ContextMenu.selectItem('Output')
  await expect(outputTab).toBeVisible()
  await expect(outputTab).toHaveCount(1)
}
