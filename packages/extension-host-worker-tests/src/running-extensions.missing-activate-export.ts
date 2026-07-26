import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.missing-activate-export'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-missing-activate'
  await activateFixture(api, id, 'onCommand:runningExtensions.missingActivate')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionStatusError')).toContainText('Error:')
}
