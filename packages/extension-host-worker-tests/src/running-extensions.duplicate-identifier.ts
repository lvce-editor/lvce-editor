import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.duplicate-identifier'

export const test: Test = async (api) => {
  const id = 'sample.error-identifier-has-already-been-declared'
  await activateFixture(api, id, 'onCommand:xyz.sampleCommand')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionStatusError')).toContainText("Identifier 'x' has already been declared")
}
