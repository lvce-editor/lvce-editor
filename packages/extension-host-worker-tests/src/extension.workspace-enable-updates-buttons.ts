import type { Test } from '@lvce-editor/test-with-playwright'
import {
  addLifecycleExtension,
  disableWorkspaceLifecycleExtension,
  enableLifecycleExtension,
  enableWorkspaceLifecycleExtension,
} from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.workspace-enable-updates-buttons'

export const test: Test = async ({ expect, ExtensionDetail, Locator, ...api }) => {
  await addLifecycleExtension(api)
  await disableWorkspaceLifecycleExtension({ ExtensionDetail, Locator, ...api })
  await enableWorkspaceLifecycleExtension({ ExtensionDetail, Locator, ...api })

  await expect(Locator('[name="Enable"]')).toBeHidden()
  await expect(Locator('[name="EnableOptions"]')).toBeHidden()
  await expect(Locator('[name="Disable"]')).toBeVisible()
  await expect(Locator('[name="DisableOptions"]')).toBeVisible()
  await enableLifecycleExtension({ ExtensionDetail, ...api })
}
