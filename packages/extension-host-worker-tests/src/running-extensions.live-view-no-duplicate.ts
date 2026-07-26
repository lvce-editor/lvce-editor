import type { Test } from '@lvce-editor/test-with-playwright'
import {
  activateLiveViewExtension,
  activityBarItemSelector,
  addLiveViewExtension,
  extensionId,
  runningExtensionSelector,
} from '../fixtures/sample.running-extensions-live-view/test.js'

export const name = 'running-extensions.live-view-no-duplicate'

export const test: Test = async ({ expect, Locator, RunningExtensions, ...api }) => {
  await addLiveViewExtension(api)
  await RunningExtensions.show()
  const runningExtension = Locator(runningExtensionSelector, { hasText: extensionId })
  await activateLiveViewExtension({ expect, Locator, ...api })
  await expect(runningExtension).toHaveCount(1)
  const activityBarItem = Locator(activityBarItemSelector)

  // eslint-disable-next-line e2e/no-direct-click
  await activityBarItem.click()
  // eslint-disable-next-line e2e/no-direct-click
  await activityBarItem.click()

  await expect(runningExtension).toHaveCount(1)
}
