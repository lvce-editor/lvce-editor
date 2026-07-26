import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.empty-name'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-empty-name'
  await activateFixture(api, id, 'onCommand:runningExtensions.emptyName')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionName')).toHaveText(id)
}
