import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension, wait } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.mixed-running-and-terminated'

export const test: Test = async (api) => {
  const runningId = 'sample.running-extensions-rich'
  const terminatedId = 'sample.running-extensions-close-100ms'
  await activateFixture(api, runningId, 'onCommand:runningExtensions.rich')
  await activateFixture(api, terminatedId, 'onCommand:runningExtensions.close100ms')
  await wait(500)
  await getRunningExtension(api, runningId)

  await api.expect(api.Locator('.RunningExtensionId', { hasText: terminatedId })).toBeVisible()
  await api.expect(api.Locator('.RunningExtensionActivationTime')).toBeVisible()
  await api.expect(api.Locator('.RunningExtensionStatusTerminated')).toBeVisible()
}
