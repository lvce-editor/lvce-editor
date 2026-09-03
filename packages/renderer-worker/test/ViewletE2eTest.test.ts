import { expect, test } from '@jest/globals'
import * as ViewletE2eTest from '../src/parts/ViewletE2eTest/ViewletE2eTest.ts'

test('loadContent uses the current server for the test iframe', async () => {
  const state = ViewletE2eTest.create(1, 'e2e-test://viewlet.about.js', 0, 0, 800, 600)

  const result = await ViewletE2eTest.loadContent(state)

  expect(result.iframeSrc).toBe('/tests/viewlet.about.html')
})
