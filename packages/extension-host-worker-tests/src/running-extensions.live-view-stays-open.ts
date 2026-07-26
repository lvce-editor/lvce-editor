import type { Test } from '@lvce-editor/test-with-playwright'
import {
  activateLiveViewExtension,
  addLiveViewExtension,
  extensionId,
  runningExtensionSelector,
} from '../fixtures/sample.running-extensions-live-view/test.js'

export const name = 'running-extensions.live-view-stays-open'

export const test: Test = async ({ expect, Locator, RunningExtensions, ...api }) => {
  await addLiveViewExtension(api)
  await RunningExtensions.show()
  const runningExtensionsView = Locator('.RunningExtensions')

  await activateLiveViewExtension({ expect, Locator, ...api })

  await expect(runningExtensionsView).toBeVisible()
  await expect(Locator(runningExtensionSelector, { hasText: extensionId })).toBeVisible()
}
