import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.isolated-healthy'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-isolated-healthy'
  await activateFixture(api, id, 'onCommand:runningExtensions.isolatedHealthy')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionActivationTime')).toBeVisible()
  await api.expect(row.locator('.RunningExtensionStatus')).toHaveCount(0)
}
