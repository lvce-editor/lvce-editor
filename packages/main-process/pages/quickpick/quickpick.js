import * as QuickPickFunctions from './QuickPickFunctions.js'
import * as QuickPickEvents from './QuickPickEvents.js'
import * as QuickPickIpc from './QuickPickIpc.js'
import { $QuickPickInput, $QuickPickItems } from './QuickPickElements.js'

const executeCommand = (command) => {
  const _0 = command[0]
  const _1 = command[1]
  const _2 = command[2]
  if (_0 === 'Viewlet.create' || _0 === 'Viewlet.show') {
    return
  }
  const args = command.slice(3)
  const fn = QuickPickFunctions[_2]
  console.log({ command })
  fn(...args)
}

const executeCommands = (commands) => {
  for (const command of commands) {
    executeCommand(command)
  }
}

const getFn = (method) => {
  switch (method) {
    case 'executeCommands':
      return executeCommands
    default:
      throw new Error('method not found')
  }
}

const handleMessage = (event) => {
  const message = event.data
  console.log({ message })
  const fn = getFn(message.method)
  fn(message.params)
}

const main = async () => {
  $QuickPickInput.addEventListener(
    'beforeinput',
    QuickPickEvents.handleBeforeInput
  )
  $QuickPickItems.onmousedown = QuickPickEvents.handleMouseDown
  const port = await QuickPickIpc.initialize()
  port.onmessage = handleMessage
}

main()
