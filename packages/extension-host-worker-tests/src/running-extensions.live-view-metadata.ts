import type { Test } from '@lvce-editor/test-with-playwright'
import {
  activateLiveViewExtension,
  addLiveViewExtension,
  extensionId,
  runningExtensionSelector,
} from '../fixtures/sample.running-extensions-live-view/test.js'

export const name = 'running-extensions.live-view-metadata'

export const test: Test = async ({ expect, Locator, RunningExtensions, ...api }) => {
  await addLiveViewExtension(api)
  await RunningExtensions.show()
  const runningExtension = Locator(runningExtensionSelector, { hasText: extensionId })

  await activateLiveViewExtension({ expect, Locator, ...api })

  await expect(runningExtension).toHaveText(extensionId)
  await expect(Locator('.RunningExtensionName', { hasText: 'Running Extensions Live View' })).toHaveText('Running Extensions Live View')
  await expect(Locator('.RunningExtensionVersion', { hasText: '1.2.3' })).toHaveText('1.2.3')
  const activationReason = 'Activation reason: onView:sample.running-extensions-live-view'
  await expect(Locator('.RunningExtensionActivationReason', { hasText: activationReason })).toHaveText(activationReason)
}
