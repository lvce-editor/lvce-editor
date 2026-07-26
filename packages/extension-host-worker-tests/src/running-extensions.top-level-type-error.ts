import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.top-level-type-error'

export const test: Test = async (api) => {
  const id = 'sample.error-cannot-read-properties-of-null-reading-value'
  await activateFixture(api, id, 'onCommand:xyz.sampleCommand')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionStatusError')).toContainText('Cannot read properties of null')
}
