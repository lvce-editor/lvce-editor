import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.missing-name'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-missing-name'
  await activateFixture(api, id, 'onCommand:runningExtensions.missingName')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionName')).toHaveText(id)
}
