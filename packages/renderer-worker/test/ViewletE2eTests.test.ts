import { expect, test } from '@jest/globals'
import * as ViewletE2eTests from '../src/parts/ViewletE2eTests/ViewletE2eTests.ts'

test('executeTest uses the current server for the test iframe', async () => {
  const state = {
    ...ViewletE2eTests.create(1, '', 0, 0, 800, 600),
    tests: ['viewlet.about.js'],
  }

  const result = await ViewletE2eTests.executeTest(state, 0)

  expect(result.iframeSrc).toBe('/tests/viewlet.about.html')
})
