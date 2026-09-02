import { expect, jest, test } from '@jest/globals'
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

test('execute - loads commands provided asynchronously', async () => {
  const execute = jest.fn(() => 'done')
  Command.state.load = async () => {
    return {
      Commands: {},
      getCommands: async () => ({ execute }),
      name: 'About',
    }
  }

  await expect(Command.execute('About.execute', 'argument')).resolves.toBe('done')
  expect(execute).toHaveBeenCalledWith('argument')
})
