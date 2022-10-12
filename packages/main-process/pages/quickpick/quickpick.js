const $Items = document.getElementById('QuickPickItems')
const $QuickPickInput = document.getElementById('QuickPickInput')

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

const exposeGlobals = (globals) => {
  for (const [key, value] of Object.entries(globals)) {
    globalThis[key] = value
  }
}

$QuickPickInput.addEventListener('beforeinput', handleBeforeInput)

exposeGlobals({
  'QuickPick.setValue': setValue,
  'QuickPick.setItems': setItems,
})
