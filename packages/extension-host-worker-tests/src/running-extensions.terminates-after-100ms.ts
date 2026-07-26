import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension, wait } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.terminates-after-100ms'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-close-100ms'
  await activateFixture(api, id, 'onCommand:runningExtensions.close100ms')
  await wait(500)
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionStatusTerminated')).toContainText('Extension worker stopped responding')
}
