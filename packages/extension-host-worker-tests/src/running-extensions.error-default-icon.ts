import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.error-default-icon'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-throw'
  await activateFixture(api, id, 'onCommand:runningExtensions.throw')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionStatusError')).toBeVisible()
  await api.expect(row.locator('.RunningExtensionDefaultIcon')).toHaveCount(1)
}
