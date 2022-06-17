// The process explorer tries to implement the ARIA TreeGrid Design Pattern https://w3c.github.io/aria-practices/examples/treegrid/treegrid-1.html

const state = {
  displayProcesses: [],
  collapsed: [],
  processes: [],
  $Tbody: undefined,
  port: undefined,
}

const formatMemory = (memory) => {
  if (memory < 1000) {
    return `${memory} B`
  }
  if (memory < 1000 ** 2) {
    return `${(memory / 1000 ** 1).toFixed(1)} kB`
  }
  if (memory < 1000 ** 3) {
    return `${(memory / 1000 ** 2).toFixed(1)} MB`
  }
  if (memory < 1000 ** 4) {
    return `${(memory / 1000 ** 3).toFixed(1)} GB`
  }
  return `${(memory / 1000 ** 4).toFixed(1)} TB`
}

const getDisplayProcesses = (processes) => {
  const displayProcesses = []

  const getChildren = (process, depth) => {
    const children = []
    for (const otherProcess of processes) {
      if (otherProcess.ppid === process.pid) {
        children.push(...withChildren(otherProcess, depth))
      }
    }
    return children
  }

  const withChildren = (process, depth) => {
    const children = getChildren(process, depth + 1)
    if (children.length === 0) {
      const displayProcess = {
        ...process,
        flags: 0,
        depth,
        // posInSet,
        // setSize,
      }
      return [displayProcess]
    }
    if (state.collapsed.includes(process.pid)) {
      const displayProcess = {
        ...process,
        flags: 1,
        depth,

        // posInSet,
        // setSize,
      }
      return [displayProcess]
    }
    const displayProcess = {
      ...process,
      flags: 2,
      depth,

      // posInSet,
      // setSize,
    }
    return [displayProcess, ...children]
  }

  const topProcess = processes[0]
  displayProcesses.push(...withChildren(topProcess, 1))
  return displayProcesses
}

const focusElement = ($Element) => {
  $Element.tabIndex = 0
  $Element.focus()
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const handleClickIndex = (index) => {
  const displayProcess = state.displayProcesses[index]
  const collapsedIndex = state.collapsed.indexOf(displayProcess.pid)
  if (collapsedIndex === -1) {
    state.collapsed.push(displayProcess.pid)
  } else {
    state.collapsed.splice(collapsedIndex, 1)
  }
  renderProcesses(state.processes)
  const oldFocusedElement = state.$Tbody.querySelector('[tabIndex="0"]')
  if (oldFocusedElement) {
    oldFocusedElement.tabIndex = -1
  }
  const newFocusedElement = state.$Tbody.children[index]
  if (newFocusedElement) {
    newFocusedElement.tabIndex = 0
  }
}

const handleDoubleClick = (event) => {
  const $Target = event.target
  switch ($Target.className) {
    case 'Row': {
      const index = getNodeIndex($Target)
      handleClickIndex(index)
      break
    }
    case 'Cell': {
      const index = getNodeIndex($Target.parentNode)
      handleClickIndex(index)
      break
    }
  }
}

const handleFocusIn = (event) => {
  console.log('focus in')
  const oldFocusedElement = state.$Tbody.querySelector('[tabIndex="0"]')
  const $Target = event.target
  if (oldFocusedElement) {
    oldFocusedElement.tabIndex = -1
  }
  console.log($Target)
  $Target.tabIndex = 0
}

const handleHomeRow = ($ActiveElement) => {
  const $FirstRow = $ActiveElement.parentElement.firstElementChild
  $FirstRow.focus()
}

const handleHomeCell = ($ActiveElement, control) => {
  if (control) {
    const index = getNodeIndex($ActiveElement)
    const $FirstRow =
      $ActiveElement.parentElement.parentElement.firstElementChild
    const $TopCell = $FirstRow.children[index]
    $TopCell.focus()
    return
  }
  const $FirstCell = $ActiveElement.parentElement.firstElementChild
  $FirstCell.focus()
}

const handleHome = (control) => {
  const $ActiveElement = document.activeElement
  switch ($ActiveElement.className) {
    case 'Row':
      handleHomeRow($ActiveElement)
      break
    case 'Cell':
      handleHomeCell($ActiveElement, control)
      break
    default:
      break
  }
}

const handleArrowUpRow = ($ActiveElement) => {
  const $RowAbove = $ActiveElement.previousElementSibling
  if (!$RowAbove) {
    return
  }
  // @ts-ignore
  $RowAbove.focus()
  return
}

const handleArrowUpCell = ($ActiveElement) => {
  const index = getNodeIndex($ActiveElement)
  const $RowAbove = $ActiveElement.parentElement.previousElementSibling
  if (!$RowAbove) {
    return
  }
  const $CellAbove = $RowAbove.children[index]
  // @ts-ignore
  $CellAbove.focus()
  return
}

const handleArrowUp = () => {
  const $ActiveElement = document.activeElement
  switch ($ActiveElement.className) {
    case 'Row':
      handleArrowUpRow($ActiveElement)
      break
    case 'Cell':
      handleArrowUpCell($ActiveElement)
      break
    default:
      break
  }
}

const handleArrowDownRow = ($ActiveElement) => {
  const $RowBelow = $ActiveElement.nextElementSibling
  if (!$RowBelow) {
    return
  }
  // @ts-ignore
  $RowBelow.focus()
  return
}

const handleArrowDownCell = ($ActiveElement) => {
  const index = getNodeIndex($ActiveElement)
  const $RowBelow = $ActiveElement.parentElement.nextElementSibling
  if (!$RowBelow) {
    return
  }
  const $CellBelow = $RowBelow.children[index]
  // @ts-ignore
  $CellBelow.focus()
  return
}

const handleArrowDown = () => {
  const $ActiveElement = document.activeElement
  switch ($ActiveElement.className) {
    case 'Row':
      handleArrowDownRow($ActiveElement)
      break
    case 'Cell':
      handleArrowDownCell($ActiveElement)
      break
    default:
      break
  }
}

const handleEndRow = ($ActiveElement) => {
  const $LastRow = $ActiveElement.parentElement.lastElementChild
  $LastRow.focus()
}

const handleEndCell = ($ActiveElement, control) => {
  if (control) {
    const index = getNodeIndex($ActiveElement)
    const $LastRow = $ActiveElement.parentElement.parentElement.lastElementChild
    const $BottomCell = $LastRow.children[index]
    $BottomCell.focus()
    return
  }
  const $LastCell = $ActiveElement.parentElement.lastElementChild
  $LastCell.focus()
}

const handleEnd = (control) => {
  const $ActiveElement = document.activeElement
  switch ($ActiveElement.className) {
    case 'Row':
      handleEndRow($ActiveElement)
      break
    case 'Cell':
      handleEndCell($ActiveElement, control)
      break
    default:
      break
  }
}

const handleArrowRightRow = ($ActiveElement) => {
  if ($ActiveElement.ariaExpanded === 'false') {
    const index = getNodeIndex($ActiveElement)
    const displayProcess = state.displayProcesses[index]
    const collapsedIndex = state.collapsed.indexOf(displayProcess.pid)
    state.collapsed.splice(collapsedIndex, 1)
    renderProcesses(state.processes)
    return
  }
  const $Cell = $ActiveElement.firstElementChild
  //  @ts-ignore
  $Cell.focus()
  // @ts-ignore
  return
}

const handleArrowRightCell = ($ActiveElement) => {
  // TODO focus next cell
  const $NextCell = $ActiveElement.nextElementSibling
  if (!$NextCell) {
    return
  }
  // @ts-ignore
  $NextCell.focus()
}

const handleArrowRight = () => {
  const $ActiveElement = document.activeElement
  switch ($ActiveElement.className) {
    case 'Row':
      handleArrowRightRow($ActiveElement)
      break
    case 'Cell':
      handleArrowRightCell($ActiveElement)
      break
    default:
      break
  }
}

const handleArrowLeftRow = ($ActiveElement) => {
  console.log($ActiveElement.ariaExpanded)
  if ($ActiveElement.ariaExpanded === 'true') {
    const index = getNodeIndex($ActiveElement)
    const displayProcess = state.displayProcesses[index]
    state.collapsed.push(displayProcess.pid)
    renderProcesses(state.processes)
    return
  }
  const index = getNodeIndex($ActiveElement)
  const displayProcess = state.displayProcesses[index]
  for (let i = index; i >= 0; i--) {
    const otherProcess = state.displayProcesses[i]
    if (otherProcess.depth === displayProcess.depth - 1) {
      const $Row = state.$Tbody.children[i]
      $Row.focus()
      break
    }
  }
}

const handleArrowLeftCell = ($ActiveElement) => {
  const $PreviousCell = $ActiveElement.previousElementSibling
  if ($PreviousCell) {
    // @ts-ignore
    $PreviousCell.focus()
    return
  }
  const $Row = $ActiveElement.parentNode
  // @ts-ignore
  $Row.focus()
}

const handleArrowLeft = () => {
  const $ActiveElement = document.activeElement
  switch ($ActiveElement.className) {
    case 'Row':
      handleArrowLeftRow($ActiveElement)
      break
    case 'Cell':
      handleArrowLeftCell($ActiveElement)
      break
    default:
      break
  }
}

const handleMouseDownCell = () => {}

const handleMouseDown = (event) => {
  const $Target = event.target
  const $ActiveElement = document.activeElement
  if ($Target === $ActiveElement) {
    return
  }
  if ($Target.className === 'Cell') {
    event.preventDefault()
    $Target.parentElement.focus()
  }
}

const handleContextMenu = (event) => {
  console.log(event)
  event.preventDefault()
  const $Target = event.target

  const $Row = $Target.parentNode
  const index = getNodeIndex($Row)

  const displayProcess = state.displayProcesses[index]
  state.port.postMessage({
    jsonrpc: '2.0',
    method: 'showContextMenu',
    params: [displayProcess.pid],
  })
}

/**
 *
 * @param {KeyboardEvent} event
 */
const handleKeyDown = (event) => {
  const key = event.key
  const control = event.ctrlKey
  switch (key) {
    case 'ArrowDown':
      event.preventDefault()
      handleArrowDown()
      break
    case 'ArrowUp':
      event.preventDefault()
      handleArrowUp()
      break
    case 'Home':
      event.preventDefault()
      handleHome(control)
      break
    case 'End':
      event.preventDefault()
      handleEnd(control)
      break
    case 'ArrowRight':
      event.preventDefault()
      handleArrowRight()
      break
    case 'ArrowLeft':
      event.preventDefault()
      handleArrowLeft()
      break
    default:
      break
  }
}

const render$Process = ($Process, process) => {
  $Process.ariaLevel = process.depth
  $Process.title = process.cmd
  switch (process.flags) {
    case /* none */ 0:
      $Process.removeAttribute('aria-expanded')
      break
    case /* collapsed */ 1:
      $Process.ariaExpanded = false
      break
    case /* expanded */ 2:
      $Process.ariaExpanded = true
      break
    default:
      break
  }
  const $Name = $Process.children[0]
  const $Id = $Process.children[1]
  const $Memory = $Process.children[2]

  const name = process.name
  const id = `${process.pid}`
  const memory = formatMemory(process.memory)

  if ($Name.firstChild.nodeValue !== name) {
    $Name.firstChild.nodeValue = name
  }
  if ($Id.firstChild.nodeValue !== id) {
    $Id.firstChild.nodeValue = id
  }
  if ($Memory.firstChild.nodeValue !== memory) {
    $Memory.firstChild.nodeValue = memory
  }
}

const create$GridCell = () => {
  const $Cell = document.createElement('td')
  $Cell.className = 'Cell'
  $Cell.setAttribute('role', 'gridcell')
  $Cell.tabIndex = -1
  const $Text = document.createTextNode('')
  $Cell.append($Text)
  return $Cell
}

const create$Row = () => {
  const $Row = document.createElement('tr')
  $Row.className = 'Row'
  $Row.setAttribute('role', 'row')
  $Row.tabIndex = -1
  // Set aria-description to empty string so that screen readers don't read title as well
  // More details https://github.com/microsoft/vscode/issues/95378
  $Row.setAttribute('aria-description', '')
  const $Name = create$GridCell()
  const $Id = create$GridCell()
  const $Memory = create$GridCell()
  $Row.append($Name, $Id, $Memory)
  return $Row
}

const render$ProcessesLess = ($Processes, processes) => {
  for (let i = 0; i < $Processes.children.length; i++) {
    render$Process($Processes.children[i], processes[i])
  }
  const fragment = document.createDocumentFragment()
  for (let i = $Processes.children.length; i < processes.length; i++) {
    const $Process = create$Row()
    render$Process($Process, processes[i])
    fragment.append($Process)
  }
  $Processes.append(fragment)
}

const render$ProcessesEqual = ($Processes, processes) => {
  for (let i = 0; i < processes.length; i++) {
    render$Process($Processes.children[i], processes[i])
  }
}

const render$ProcessesMore = ($Processes, processes) => {
  for (let i = 0; i < processes.length; i++) {
    render$Process($Processes.children[i], processes[i])
  }
  const diff = $Processes.children.length - processes.length
  for (let i = processes.length; i < processes.length + diff; i++) {
    $Processes.lastChild.remove()
  }
}

const renderProcesses = (processes) => {
  const displayProcesses = getDisplayProcesses(processes)
  state.processes = processes
  state.displayProcesses = displayProcesses
  const $Tbody = document.querySelector('tbody')
  if ($Tbody.children.length < displayProcesses.length) {
    render$ProcessesLess($Tbody, displayProcesses)
  } else if ($Tbody.children.length === displayProcesses.length) {
    render$ProcessesEqual($Tbody, displayProcesses)
  } else {
    render$ProcessesMore($Tbody, displayProcesses)
  }
  $Tbody.ondblclick = handleDoubleClick
  $Tbody.onkeydown = handleKeyDown
  $Tbody.addEventListener('focusin', handleFocusIn, { capture: true })
  $Tbody.onmousedown = handleMouseDown
  $Tbody.oncontextmenu = handleContextMenu
  state.$Tbody = $Tbody
}

const handleMessage = (message) => {
  const { method, params } = message
  switch (method) {
    case 'processWithMemoryUsage':
      renderProcesses(...params)
      break
    default:
      break
  }
}

const handleMessageFromPort = (event) => {
  const message = event.data
  handleMessage(message)
}

const handleFirstMessage = (event) => {
  const port = event.ports[0]
  port.onmessage = handleMessageFromPort
  state.port = port

  const update = () => {
    port.postMessage({
      jsonrpc: '2.0',
      method: 'updateStats',
      params: [],
    })
  }
  setInterval(update, 1000)
  update()
}

const main = async () => {
  window.addEventListener('message', handleFirstMessage, { once: true })
  // @ts-ignore
  window.myApi.ipcConnect()
}

main()
