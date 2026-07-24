import type { Test } from '@lvce-editor/test-with-playwright'
import { activityBarItemSelector, addLifecycleExtension, disableLifecycleExtension } from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.disable-hides-activity-bar-item'

export const test: Test = async ({ expect, Locator, ...api }) => {
  await addLifecycleExtension(api)
  const activityBarItem = Locator(activityBarItemSelector)
  await expect(activityBarItem).toBeVisible()

  await disableLifecycleExtension(api)

  await expect(activityBarItem).toBeHidden()
}
