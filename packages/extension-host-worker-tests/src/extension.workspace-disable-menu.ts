import type { Test } from '@lvce-editor/test-with-playwright'
import { addWorkspaceLifecycleExtension, extensionId } from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.workspace-disable-menu'

export const test: Test = async ({ expect, ExtensionDetail, Locator, ...api }) => {
  await addWorkspaceLifecycleExtension(api)
  await ExtensionDetail.open(extensionId)

  const splitButton = Locator('.ExtensionEnablementSplitButton')
  const primaryButton = Locator('[name="Disable"]')
  const optionsButton = Locator('[name="DisableOptions"]')
  await expect(splitButton).toHaveCount(1)
  await expect(primaryButton).toBeVisible()
  await expect(optionsButton).toHaveAttribute('aria-label', 'Disable options')
  await expect(optionsButton).toHaveAttribute('title', 'Disable options')
  await expect(optionsButton).toHaveClass('ExtensionEnablementSplitButtonDropDown')
}
