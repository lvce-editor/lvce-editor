import type { Test } from '@lvce-editor/test-with-playwright'
import {
  activityBarItemSelector,
  addLifecycleExtension,
  disableLifecycleExtension,
  enableLifecycleExtension,
} from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.enable-shows-activity-bar-item'

export const test: Test = async ({ expect, Locator, ...api }) => {
  await addLifecycleExtension(api)
  const activityBarItem = Locator(activityBarItemSelector)
  await disableLifecycleExtension(api)
  await expect(activityBarItem).toBeHidden()

  await enableLifecycleExtension(api)

  await expect(activityBarItem).toBeVisible()
}
