import type { Test } from '@lvce-editor/test-with-playwright'
import { addLifecycleExtension, enableLifecycleExtension, extensionId } from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.workspace-disable-menu'

export const test: Test = async ({ expect, ExtensionDetail, Locator, ...api }) => {
  await addLifecycleExtension(api)
  await ExtensionDetail.open(extensionId)

  const primaryButton = Locator('[name="Disable"]')
  const optionsButton = Locator('[name="DisableOptions"]')
  await expect(primaryButton).toBeVisible()
  await expect(optionsButton).toHaveAttribute('aria-label', 'Disable options')
  await optionsButton.click()

  const menuItems = Locator('#ContextMenu .MenuItem')
  await expect(menuItems).toHaveCount(2)
  await expect(menuItems.nth(0)).toHaveText('Disable')
  await expect(menuItems.nth(1)).toHaveText('Disable (Workspace)')
  await enableLifecycleExtension({ ExtensionDetail, ...api })
}
