import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.panel-tab-context-menu'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPanel', 'Problems')

  const problemsTab = Locator('.PanelTab[name="Problems"]')
  const outputTab = Locator('.PanelTab[name="Output"]')

  await expect(problemsTab).toBeVisible()
  await expect(outputTab).toBeVisible()

  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Playwright's supported button option issues the tab contextmenu event
  await problemsTab.click({ button: 'right' })
  const menuItems = Locator('.MenuItem')
  await expect(menuItems).toHaveCount(6)
  await expect(menuItems.nth(0)).toHaveText('Problems')
  await expect(menuItems.nth(1)).toHaveText('Output')
  await expect(menuItems.nth(1)).toHaveAttribute('aria-checked', 'true')
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Selecting the rendered context-menu entry exercises the browser click path
  await menuItems.nth(1).click()
  await expect(outputTab).toHaveCount(0)

  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Playwright's supported button option issues the tab contextmenu event
  await problemsTab.click({ button: 'right' })
  await expect(menuItems).toHaveCount(6)
  await expect(menuItems.nth(1)).toHaveText('Output')
  await expect(menuItems.nth(1)).toHaveAttribute('aria-checked', 'false')
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Selecting the rendered context-menu entry exercises the browser click path
  await menuItems.nth(1).click()
  await expect(outputTab).toBeVisible()
  await expect(outputTab).toHaveCount(1)
}
