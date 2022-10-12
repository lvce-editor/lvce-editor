const $Items = document.getElementById('QuickPickItems')
const $QuickPickInput = document.getElementById('QuickPickInput')

if (!$QuickPickInput || !($QuickPickInput instanceof HTMLInputElement)) {
  throw new Error('missing quick pick input')
}
if (!$Items) {
  throw new Error('missing items')
}

const create$Item = (item) => {
  const $QuickPickItemIcon = document.createElement('div')
  $QuickPickItemIcon.className = 'QuickPickItemIcon'
  const $QuickPickItemLabel = document.createElement('div')
  $QuickPickItemLabel.className = 'Label'
  $QuickPickItemLabel.textContent = item.label

  const $QuickPickItem = document.createElement('div')
  $QuickPickItem.className = 'QuickPickItem'
  $QuickPickItem.append($QuickPickItemIcon, $QuickPickItemLabel)

  return $QuickPickItem
}
const setItems = (items) => {
  $Items.replaceChildren(...items.map(create$Item))
}

const setValue = (value) => {
  $QuickPickInput.value = value
}

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

const getFn = (method) => {
  switch (method) {
    case 'setValue':
      return setValue
    default:
      throw new Error('method not found')
  }
}

const handleMessage = (event) => {
  const message = event.data
  const fn = getFn(message.method)
  fn(...message.params)
}

const main = async () => {
  $QuickPickInput.focus()
  const port = await getPort('quickpick-browserview')
  port.onmessage = handleMessage
  console.log({ port })
}

main()

// const exposeGlobals = (globals) => {
//   for (const [key, value] of Object.entries(globals)) {
//     globalThis[key] = value
//   }
// }

// $QuickPickInput.addEventListener('beforeinput', handleBeforeInput)

// exposeGlobals({
//   'QuickPick.setValue': setValue,
//   'QuickPick.setItems': setItems,
// })
