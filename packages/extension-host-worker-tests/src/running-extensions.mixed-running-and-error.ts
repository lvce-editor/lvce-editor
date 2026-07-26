import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.mixed-running-and-error'

export const test: Test = async (api) => {
  const runningId = 'sample.running-extensions-rich'
  const errorId = 'sample.running-extensions-throw'
  await activateFixture(api, runningId, 'onCommand:runningExtensions.rich')
  await activateFixture(api, errorId, 'onCommand:runningExtensions.throw')
  await getRunningExtension(api, runningId)

  await api.expect(api.Locator('.RunningExtensionId', { hasText: errorId })).toBeVisible()
  await api.expect(api.Locator('.RunningExtensionActivationTime')).toBeVisible()
  await api.expect(api.Locator('.RunningExtensionStatusError')).toBeVisible()
}
