import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.invalid-name'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-invalid-name'
  await activateFixture(api, id, 'onCommand:runningExtensions.invalidName')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionName')).toHaveText(id)
}
