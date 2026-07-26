import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.missing-main-entry'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-missing-main'
  await activateFixture(api, id, 'onCommand:runningExtensions.missingMain')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionStatusError')).toContainText('not-found.js')
}
