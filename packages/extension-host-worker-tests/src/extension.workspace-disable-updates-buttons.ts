import type { Test } from '@lvce-editor/test-with-playwright'
import {
  addWorkspaceLifecycleExtension,
  disableWorkspaceLifecycleExtension,
  enableLifecycleExtension,
} from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.workspace-disable-updates-buttons'

export const test: Test = async ({ expect, ExtensionDetail, Locator, ...api }) => {
  await addWorkspaceLifecycleExtension(api)
  await disableWorkspaceLifecycleExtension({ ExtensionDetail, ...api })

  await expect(Locator('[name="Disable"]')).toBeHidden()
  await expect(Locator('[name="DisableOptions"]')).toBeHidden()
  await expect(Locator('[name="Enable"]')).toBeVisible()
  await expect(Locator('[name="EnableOptions"]')).toBeVisible()
  await enableLifecycleExtension({ ExtensionDetail, ...api })
}
