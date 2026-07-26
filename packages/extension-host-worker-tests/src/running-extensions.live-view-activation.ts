import type { Test } from '@lvce-editor/test-with-playwright'
import {
  activateLiveViewExtension,
  addLiveViewExtension,
  extensionId,
  runningExtensionSelector,
} from '../fixtures/sample.running-extensions-live-view/test.js'

export const name = 'running-extensions.live-view-activation'

export const test: Test = async ({ expect, Locator, RunningExtensions, ...api }) => {
  await addLiveViewExtension(api)
  await RunningExtensions.show()
  const runningExtension = Locator(runningExtensionSelector, { hasText: extensionId })
  await expect(runningExtension).toBeHidden()

  await activateLiveViewExtension({ expect, Locator, ...api })

  await expect(runningExtension).toBeVisible()
}
