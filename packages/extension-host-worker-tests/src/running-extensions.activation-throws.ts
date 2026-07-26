import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.activation-throws'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-throw'
  await activateFixture(api, id, 'onCommand:runningExtensions.throw')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionStatusError')).toHaveText('Error: Activation exploded')
}
