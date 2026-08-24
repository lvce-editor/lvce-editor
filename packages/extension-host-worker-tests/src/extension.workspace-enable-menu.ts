import type { Test } from '@lvce-editor/test-with-playwright'
import {
  addLifecycleExtension,
  disableWorkspaceLifecycleExtension,
  enableLifecycleExtension,
} from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.workspace-enable-menu'

export const test: Test = async ({ expect, ExtensionDetail, Locator, ...api }) => {
  await addLifecycleExtension(api)
  await disableWorkspaceLifecycleExtension({ ExtensionDetail, Locator, ...api })

  const primaryButton = Locator('[name="Enable"]')
  const optionsButton = Locator('[name="EnableOptions"]')
  await expect(primaryButton).toBeVisible()
  await expect(optionsButton).toHaveAttribute('aria-label', 'Enable options')
  await optionsButton.click()

  const menuItems = Locator('#ContextMenu .MenuItem')
  await expect(menuItems).toHaveCount(2)
  await expect(menuItems.nth(0)).toHaveText('Enable')
  await expect(menuItems.nth(1)).toHaveText('Enable (Workspace)')
  await enableLifecycleExtension({ ExtensionDetail, ...api })
}
