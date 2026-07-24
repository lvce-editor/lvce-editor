import type { Test } from '@lvce-editor/test-with-playwright'
import {
  addLifecycleExtension,
  disableLifecycleExtension,
  enableLifecycleExtension,
  statusBarItemSelector,
} from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.enable-shows-status-bar-item'

export const test: Test = async ({ expect, Locator, ...api }) => {
  await addLifecycleExtension(api)
  const statusBarItem = Locator(statusBarItemSelector)
  await disableLifecycleExtension(api)
  await expect(statusBarItem).toBeHidden()

  await enableLifecycleExtension(api)

  await expect(statusBarItem).toBeVisible()
}
