import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension, wait } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.terminates-after-one-second'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-close-1s'
  await activateFixture(api, id, 'onCommand:runningExtensions.close1s')
  await wait(1400)
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionStatusTerminated')).toContainText('Terminated:')
}
