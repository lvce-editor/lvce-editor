import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.missing-version'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-missing-version'
  await activateFixture(api, id, 'onCommand:runningExtensions.missingVersion')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionVersion')).toHaveText('')
}
