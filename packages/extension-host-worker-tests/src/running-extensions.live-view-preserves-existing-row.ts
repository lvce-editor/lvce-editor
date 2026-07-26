import type { Test } from '@lvce-editor/test-with-playwright'
import {
  addLifecycleExtension,
  extensionId as lifecycleExtensionId,
  runningExtensionSelector as lifecycleExtensionSelector,
} from '../fixtures/sample.extension-disable-lifecycle/test.js'
import {
  activateLiveViewExtension,
  addLiveViewExtension,
  extensionId as liveViewExtensionId,
  runningExtensionSelector as liveViewExtensionSelector,
} from '../fixtures/sample.running-extensions-live-view/test.js'

export const name = 'running-extensions.live-view-preserves-existing-row'

export const test: Test = async ({ expect, Locator, RunningExtensions, ...api }) => {
  await addLifecycleExtension(api)
  await addLiveViewExtension(api)
  await RunningExtensions.show()
  const lifecycleExtension = Locator(lifecycleExtensionSelector, { hasText: lifecycleExtensionId })
  const liveViewExtension = Locator(liveViewExtensionSelector, { hasText: liveViewExtensionId })
  await expect(lifecycleExtension).toBeVisible()
  await expect(liveViewExtension).toBeHidden()

  await activateLiveViewExtension({ expect, Locator, ...api })

  await expect(lifecycleExtension).toBeVisible()
  await expect(liveViewExtension).toBeVisible()
}
