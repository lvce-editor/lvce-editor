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
  $KeyBindingsTableHeadRow.className = 'KeyBindingsTableRow'
  $KeyBindingsTableHeadRow.ariaRowIndex = '1'
  $KeyBindingsTableHeadRow.append(
    $KeyBindingsTableHeadRowColumnCommand,
    $KeyBindingsTableHeadRowColumnKey,
    $KeyBindingsTableHeadRowColumnWhen
  )

  const $KeyBindingsTableHead = document.createElement('thead')
  $KeyBindingsTableHead.className = 'KeyBindingsTableHead'
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

export const setRowCount = (state, rowCount) => {
  const { $KeyBindingsTable } = state
  $KeyBindingsTable.ariaRowCount = rowCount
}

const render$Row = ($Row, keyBinding) => {}

const render$RowsLess = ($TableBody, keyBindings) => {}

const render$RowsEqual = ($TableBody, keyBindings) => {}

const render$RowsMore = ($TableBody, keyBindings) => {
  // $KeyBindingsTableBody.textContent = ''
  for (const keyBinding of keyBindings) {
    const $TdCommand = document.createElement('td')
    $TdCommand.className = 'KeyBindingsTableCell'
    $TdCommand.textContent = keyBinding.command

    const $TdKeyBinding = document.createElement('td')
    $TdKeyBinding.className = 'KeyBindingsTableCell'
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

    const $TdWhen = document.createElement('td')
    $TdWhen.className = 'KeyBindingsTableCell'
    $TdWhen.textContent = keyBinding.when

    const $Row = document.createElement('tr')
    $Row.className = 'KeyBindingsTableRow'
    $Row.ariaRowIndex = keyBinding.rowIndex
    $Row.append($TdCommand, $TdKeyBinding, $TdWhen)
    $KeyBindingsTableBody.append($Row)
  }
}

export const setKeyBindings = (state, keyBindings) => {
  const { $KeyBindingsTableBody } = state
  const childCount = $KeyBindingsTableBody.children.length
  const keyBindingsCount = keyBindings.length
  if (childCount < keyBindingsCount) {
    return render$RowsLess($KeyBindingsTableBody, keyBindings)
  }
  if (childCount === keyBindingsCount) {
    return render$RowsEqual($KeyBindingsTableBody, keyBindings)
  }
  return render$RowsMore($KeyBindingsTableBody, keyBindings)
}

const renderDomTextNode = (element) => {
  return document.createTextNode(element.props.text)
}

const setProps = ($Element, props) => {
  for (const [key, value] of Object.entries(props)) {
    $Element.setAttribute(key, value)
  }
}

const renderDomElement = (element) => {
  const { type, children, props } = element
  const $Element = document.createElement(type)
  setProps($Element, props)
  const $Child = renderDomElementFragment(children)
  $Element.append($Child)
  return $Element
}

const DomFlags = {
  Element: 1,
  TextNode: 2,
}

const renderDom = (element) => {
  switch (element.flags) {
    case DomFlags.TextNode:
      return renderDomTextNode(element)
    case DomFlags.Element:
      return renderDomElement(element)
  }
}

const renderDomElementFragment = (elements) => {
  const $Fragment = document.createDocumentFragment()
  for (const element of elements) {
    if (element) {
      const $Element = renderDom(element)
      $Fragment.append($Element)
    }
  }
  return $Fragment
}

const clearNode = ($Element) => {
  const $Fragment = document.createDocumentFragment()
  $Fragment.append(...[...$Element.children])
}

export const setTableDom = (state, dom) => {
  const { $KeyBindingsTableBody } = state
  clearNode($KeyBindingsTableBody)
  const $Fragment = renderDomElementFragment(dom)
  $KeyBindingsTableBody.append($Fragment)
}
