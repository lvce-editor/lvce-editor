import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension, wait } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.mixed-all-statuses'

export const test: Test = async (api) => {
  const runningId = 'sample.running-extensions-rich'
  const errorId = 'sample.running-extensions-throw'
  const terminatedId = 'sample.running-extensions-close-immediately'
  await activateFixture(api, runningId, 'onCommand:runningExtensions.rich')
  await activateFixture(api, errorId, 'onCommand:runningExtensions.throw')
  await activateFixture(api, terminatedId, 'onCommand:runningExtensions.closeImmediately')
  await wait(400)
  await getRunningExtension(api, runningId)

  await api.expect(api.Locator('.RunningExtension')).toHaveCount(3)
  await api.expect(api.Locator('.RunningExtensionId', { hasText: errorId })).toBeVisible()
  await api.expect(api.Locator('.RunningExtensionId', { hasText: terminatedId })).toBeVisible()
  await api.expect(api.Locator('.RunningExtensionStatusError')).toBeVisible()
  await api.expect(api.Locator('.RunningExtensionStatusTerminated')).toBeVisible()
}
