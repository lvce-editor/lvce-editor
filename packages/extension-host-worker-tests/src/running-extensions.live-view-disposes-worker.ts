import type { Test } from '@lvce-editor/test-with-playwright'
import {
  activateLiveViewExtension,
  addLiveViewExtension,
  deactivateLiveViewExtension,
  extensionId,
  runningExtensionSelector,
} from '../fixtures/sample.running-extensions-live-view/test.js'

export const name = 'running-extensions.live-view-disposes-worker'

export const test: Test = async ({ Command, expect, Locator, RunningExtensions, ...api }) => {
  await addLiveViewExtension(api)
  await RunningExtensions.show()
  const runningExtension = Locator(runningExtensionSelector, { hasText: extensionId })

  await activateLiveViewExtension({ expect, Locator })
  const runningExtensionsAfterActivation = await Command.execute('ExtensionManagement.getRunningExtensions')
  await RunningExtensions.setExtensions(runningExtensionsAfterActivation)
  await expect(runningExtension).toBeVisible()

  await deactivateLiveViewExtension({ expect, Locator })

  const runningExtensionsAfterDisposal = await Command.execute('ExtensionManagement.getRunningExtensions')
  await RunningExtensions.setExtensions(runningExtensionsAfterDisposal)
  await expect(runningExtension).toBeHidden()

  await activateLiveViewExtension({ expect, Locator })
  const runningExtensionsAfterReactivation = await Command.execute('ExtensionManagement.getRunningExtensions')
  await RunningExtensions.setExtensions(runningExtensionsAfterReactivation)
  await expect(runningExtension).toBeVisible()
}
