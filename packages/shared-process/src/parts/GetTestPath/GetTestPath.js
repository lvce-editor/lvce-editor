import { isAbsolute, join } from 'path'
import * as Root from '../Root/Root.js'

export const getTestPath = () => {
  if (process.env.TEST_PATH) {
    const testPath = process.env.TEST_PATH
    if (isAbsolute(testPath)) {
      return testPath
    }
    return join(process.cwd(), testPath)
  }
  return join(Root.root, 'packages', 'extension-host-worker-tests')
}
