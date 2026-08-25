import type { Test } from '@lvce-editor/test-with-playwright'
import { addWorkspaceLifecycleExtension, disableWorkspaceLifecycleExtension } from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.workspace-enable-menu'

export const test: Test = async ({ expect, ExtensionDetail, Locator, ...api }) => {
  await addWorkspaceLifecycleExtension(api)
  await disableWorkspaceLifecycleExtension({ ExtensionDetail, ...api })

  const splitButton = Locator('.ExtensionEnablementSplitButton')
  const primaryButton = Locator('[name="Enable"]')
  const optionsButton = Locator('[name="EnableOptions"]')
  await expect(splitButton).toHaveCount(1)
  await expect(primaryButton).toBeVisible()
  await expect(primaryButton).toHaveCSS('user-select', 'none')
  await expect(optionsButton).toHaveAttribute('aria-label', 'Enable options')
  await expect(optionsButton).toHaveAttribute('title', 'Enable options')
  await expect(optionsButton).toHaveClass('ExtensionEnablementSplitButtonDropDown')
}
