import * as Command from '../src/parts/Command/Command.js'
import * as CommandState from '../src/parts/CommandState/CommandState.js'

test('execute - error - command not found', () => {
  CommandState.state.commands = Object.create(null)
  expect(() => Command.execute('Test.test')).toThrow(new Error(`[extension-host-sub-worker] command not found Test.test`))
})
