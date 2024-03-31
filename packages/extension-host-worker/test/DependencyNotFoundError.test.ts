import { expect, test } from '@jest/globals'
import { DependencyNotFoundError } from '../src/parts/DependencyNotFoundError/DependencyNotFoundError.ts'

test('DependencyNotFoundError', () => {
  const code = "import notFound from './not-found.ts'\n\nexport const add = (a, b) => {\n  return a + b\n}\n"
  const start = 21
  const end = 37
  const dependencyRelativePath = './not-found.ts'
  const dependencyUrl = '/test/packages/extension-host-worker-tests/fixtures/sample.error-dependency-module-not-found/not-found.ts'
  const sourceUrl = '/test/packages/extension-host-worker-tests/fixtures/sample.error-dependency-module-not-found/add.ts'
  const error = new DependencyNotFoundError(code, start, end, dependencyRelativePath, dependencyUrl, sourceUrl)
  expect(error.message).toBe('Module not found "./not-found.ts"')
  expect(error.stack).toBe(`Module not found "./not-found.ts"
    at Module (/test/packages/extension-host-worker-tests/fixtures/sample.error-dependency-module-not-found/add.ts:1:0)`)
})
