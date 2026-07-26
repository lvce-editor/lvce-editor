import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.missing-icon'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-missing-icon'
  await activateFixture(api, id, 'onCommand:runningExtensions.missingIcon')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionDefaultIcon')).toHaveCount(1)
  await api.expect(row.locator('img.RunningExtensionIcon')).toHaveCount(0)
}
