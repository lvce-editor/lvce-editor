import { DependencyNotFoundError } from '../src/parts/DependencyNotFoundError/DependencyNotFoundError.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('DependencyNotFoundError', () => {
  const code = "import notFound from './not-found.js'\n\nexport const add = (a, b) => {\n  return a + b\n}\n"
  const start = 21
  const end = 37
  const dependencyRelativePath = './not-found.js'
  const dependencyUrl = '/test/packages/extension-host-worker-tests/fixtures/sample.error-dependency-module-not-found/not-found.js'
  const sourceUrl = '/test/packages/extension-host-worker-tests/fixtures/sample.error-dependency-module-not-found/add.js'
  const error = new DependencyNotFoundError(code, start, end, dependencyRelativePath, dependencyUrl, sourceUrl)
  expect(error.message).toBe('Module not found "./not-found.js"')
  expect(error.stack).toBe(`Module not found "./not-found.js"
    at Module (/test/packages/extension-host-worker-tests/fixtures/sample.error-dependency-module-not-found/add.js:1:0)`)
})
