import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as Command from '../src/parts/Command/Command.js'

test('execute - error - failed to load module', async () => {
  Command.state.load = (moduleId) => {
    throw new TypeError('Failed to fetch dynamically imported module: http://localhost:3000/packages/renderer-worker/src/parts/Test/Test.ipc.js')
  }
  await expect(Command.execute('Test.execute')).rejects.toThrow(
    new Error(
      'failed to load module 41: TypeError: Failed to fetch dynamically imported module: http://localhost:3000/packages/renderer-worker/src/parts/Test/Test.ipc.js',
    ),
  )
})
