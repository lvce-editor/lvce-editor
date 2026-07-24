import type { Test } from '@lvce-editor/test-with-playwright'
import { addLifecycleExtension, disableLifecycleExtension, statusBarItemSelector } from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.disable-hides-status-bar-item'

export const test: Test = async ({ expect, Locator, ...api }) => {
  await addLifecycleExtension(api)
  const statusBarItem = Locator(statusBarItemSelector)
  await expect(statusBarItem).toBeVisible()

  await disableLifecycleExtension(api)

  await expect(statusBarItem).toBeHidden()
}
