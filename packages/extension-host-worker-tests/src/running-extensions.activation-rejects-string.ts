import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.activation-rejects-string'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-reject-string'
  await activateFixture(api, id, 'onCommand:runningExtensions.rejectString')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionStatusError')).toContainText('JsonRpc Error')
}
