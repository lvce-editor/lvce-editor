import { isAbsolute, join } from 'node:path'
import * as Root from '../Root/Root.js'

export const getResolvedTestPath = () => {
  const { TEST_PATH } = process.env
  if (TEST_PATH) {
    if (isAbsolute(TEST_PATH)) {
      return TEST_PATH
    }
    return join(process.cwd(), TEST_PATH)
  }
  return join(Root.root, 'packages', 'extension-host-worker-tests')
}