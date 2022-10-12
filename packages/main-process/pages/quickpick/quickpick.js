import * as QuickPickFunctions from './QuickPickFunctions.js'

const handleBeforeInput = (event) => {
  event.preventDefault()
  const { target, inputType, data } = event
  const { selectionStart, selectionEnd } = target
  globalThis.electronApi.handleMessage(
    /* method */ 'QuickPick.handleBeforeInput',
    /* inputType */ inputType,
    /* data */ data,
    /* selectionStart */ selectionStart,
    /* selectionEnd */ selectionEnd
  )
}

const getPort = (type) => {
  return new Promise((resolve, reject) => {
    const handleMessageFromWindow = (event) => {
      const port = event.ports[0]
      resolve(port)
    }

    // @ts-ignore
    window.addEventListener('message', handleMessageFromWindow, {
      once: true,
    })
    // @ts-ignore
    window.myApi.ipcConnect(type)
  })
}

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
  const port = await getPort('quickpick-browserview')
  port.onmessage = handleMessage
}

main()
