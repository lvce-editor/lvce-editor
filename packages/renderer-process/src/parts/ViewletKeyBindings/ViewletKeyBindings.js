import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletkeyBindingsEvents from './ViewletKeyBindingsEvents.js'

export const name = 'KeyBindings'

export const create = () => {
  const $InputBox = InputBox.create()
  $InputBox.type = 'search'
  $InputBox.placeholder = 'Search Key Bindings' // TODO placeholder string should come from renderer worker
  $InputBox.oninput = ViewletkeyBindingsEvents.handleInput

  const $KeyBindingsHeader = document.createElement('div')
  $KeyBindingsHeader.className = 'KeyBindingsHeader'
  $KeyBindingsHeader.append($InputBox)

  const $KeyBindingsTableHeadRowColumnCommand = document.createElement('th')
  $KeyBindingsTableHeadRowColumnCommand.textContent = 'Command'
  const $KeyBindingsTableHeadRowColumnKey = document.createElement('th')
  $KeyBindingsTableHeadRowColumnKey.textContent = 'Key'
  const $KeyBindingsTableHeadRowColumnWhen = document.createElement('th')
  $KeyBindingsTableHeadRowColumnWhen.textContent = 'When'

  const $KeyBindingsTableHeadRow = document.createElement('tr')
  $KeyBindingsTableHeadRow.append(
    $KeyBindingsTableHeadRowColumnCommand,
    $KeyBindingsTableHeadRowColumnKey,
    $KeyBindingsTableHeadRowColumnWhen
  )

  const $KeyBindingsTableHead = document.createElement('thead')
  $KeyBindingsTableHead.append($KeyBindingsTableHeadRow)

  const $KeyBindingsTableBody = document.createElement('tbody')
  $KeyBindingsTableBody.className = 'KeyBindingsTableBody'
  $KeyBindingsTableBody.addEventListener(
    'wheel',
    ViewletkeyBindingsEvents.handleWheel,
    { passive: true }
  )

  const $KeyBindingsTable = document.createElement('table')
  $KeyBindingsTable.className = 'KeyBindingsTable'
  $KeyBindingsTable.ariaLabel = 'KeyBindings'
  $KeyBindingsTable.append($KeyBindingsTableHead, $KeyBindingsTableBody)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'KeyBindings'
  $Viewlet.append($KeyBindingsHeader, $KeyBindingsTable)

  return {
    $Viewlet,
    $InputBox,
    $KeyBindingsHeader,
    $KeyBindingsTable,
    $KeyBindingsTableBody,
  }
}

export const setKeyBindings = (state, keyBindings) => {
  const { $KeyBindingsTableBody } = state
  $KeyBindingsTableBody.textContent = ''
  for (const keyBinding of keyBindings) {
    const $TdCommand = document.createElement('td')
    $TdCommand.textContent = keyBinding.command

    const $TdKeyBinding = document.createElement('td')
    if (keyBinding.isShift) {
      const $KbdShift = document.createElement('kbd')
      $KbdShift.textContent = 'Shift'
      const $KbdSeparator = document.createTextNode('+')
      $TdKeyBinding.append($KbdShift, $KbdSeparator)
    }
    if (keyBinding.isCtrl) {
      const $KbdCtrl = document.createElement('kbd')
      $KbdCtrl.textContent = 'Ctrl'
      const $KbdSeparator = document.createTextNode('+')
      $TdKeyBinding.append($KbdCtrl, $KbdSeparator)
    }
    const $KbdKey = document.createElement('kbd')
    $KbdKey.textContent = keyBinding.key
    $TdKeyBinding.append($KbdKey, $KbdKey)
    $TdKeyBinding.className = 'KeyBinding'

    const $TdWhen = document.createElement('td')
    $TdWhen.textContent = keyBinding.when

    const $Row = document.createElement('tr')
    $Row.className = 'TableRow'
    $Row.append($TdCommand, $TdKeyBinding, $TdWhen)
    $KeyBindingsTableBody.append($Row)
  }
}
