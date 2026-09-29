import { isAbsolute, join } from 'node:path'
import * as Root from '../Root/Root.ts'

const getCliTestPath = (): any => {
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--test-path=')) {
      return arg.slice('--test-path='.length)
    }
  }
  return ''
}

export const getResolvedTestPath = (): any => {
  const cliTestPath = getCliTestPath()
  const testPath = cliTestPath || process.env.TEST_PATH
  if (testPath) {
    if (isAbsolute(testPath)) {
      return testPath
    }
    return join(process.cwd(), testPath)
  }
  return join(Root.root, 'packages', 'extension-host-worker-tests')
}
