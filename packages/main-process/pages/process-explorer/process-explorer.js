// The process explorer tries to implement the ARIA TreeGrid Design Pattern https://w3c.github.io/aria-practices/examples/treegrid/treegrid-1.html

const state = {
  displayProcesses: [],
  collapsed: [],
  processes: [],
  $Tbody: undefined,
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
    default:
      throw new Error('unexpected class name')
  }
}

const handleFocusIn = (event) => {
  const oldFocusedElement = state.$Tbody.querySelector('[tabIndex="0"]')
  const $Target = event.target
  if (oldFocusedElement) {
    oldFocusedElement.tabIndex = -1
  }
  $Target.tabIndex = 0
}

const handleHomeRow = ($ActiveElement) => {
  const $FirstRow = $ActiveElement.parentElement.firstElementChild
  $FirstRow.focus()
}

const handleHomeCell = ($ActiveElement, control) => {
  if (control) {
    const index = getNodeIndex($ActiveElement)
    const $FirstRow = $ActiveElement.parentElement.parentElement.firstElementChild
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

const IsDebuggable = {
  isDebuggable(command) {
    return command.includes('node ') || command.includes('node.exe') || command.includes('node.mojom.NodeService')
  },
}

const UiStrings = {
  KillProcess: 'Kill Process',
  DebugProcess: 'Debug Process',
}

const getMenuItems = (displayProcess) => {
  const menuItems = [
    {
      label: UiStrings.KillProcess,
    },
  ]
  if (IsDebuggable.isDebuggable(displayProcess.cmd)) {
    menuItems.push({
      label: UiStrings.DebugProcess,
    })
  }
  return menuItems
}

const handleContextMenuSelect = (label, displayProcess) => {
  switch (label) {
    case UiStrings.DebugProcess:
      return ProcessExplorer.invoke('AttachDebugger.attachDebugger', displayProcess.pid)
    case UiStrings.KillProcess:
      return ProcessExplorer.invoke('Process.kill', displayProcess.pid)
    default:
      break
  }
}

const processExplorerShowContextMenu = async (displayProcess, x, y) => {
  const menuItems = getMenuItems(displayProcess)
  const customData = displayProcess
  const event = await ProcessExplorer.invoke('ElectronContextMenu.openContextMenu', menuItems, x, y, customData)
  if (event.type === 'close') {
    return
  }
  handleContextMenuSelect(event.data, displayProcess)
}

const handleContextMenu = async (event) => {
  event.preventDefault()
  const { clientX, clientY } = event
  const $Target = event.target

  const $Row = $Target.parentNode
  const index = getNodeIndex($Row)

  const displayProcess = state.displayProcesses[index]
  await processExplorerShowContextMenu(displayProcess, clientX, clientY)
}

/**
 *
 * @param {KeyboardEvent} event
 */
const handleKeyDown = (event) => {
  const { key } = event
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

const ProcessFlag = {
  None: 0,
  Collapsed: 1,
  Expanded: 2,
}

const getPaddingLeft = (process) => {
  if (process.depth === 1) {
    return '0'
  }
  const depthCh = (process.depth - 1) * 1.5
  if (process.flags === ProcessFlag.None) {
    return `calc(${depthCh}ch + 17px)`
  }
  return `${depthCh}ch`
}

const render$Process = ($Process, process) => {
  $Process.ariaLevel = process.depth
  $Process.firstChild.style.paddingLeft = getPaddingLeft(process)
  $Process.title = process.cmd
  switch (process.flags) {
    case ProcessFlag.None:
      $Process.removeAttribute('aria-expanded')
      break
    case ProcessFlag.Collapsed:
      $Process.ariaExpanded = false
      break
    case ProcessFlag.Expanded:
      $Process.ariaExpanded = true
      break
    default:
      break
  }
  const $Name = $Process.children[0]
  const $Id = $Process.children[1]
  const $Memory = $Process.children[2]

  const { name } = process
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
  // @ts-ignore
  $Cell.role = 'gridcell'
  $Cell.tabIndex = -1
  const $Text = document.createTextNode('')
  $Cell.append($Text)
  return $Cell
}

const create$Row = () => {
  const $Row = document.createElement('tr')
  $Row.className = 'Row'
  // @ts-ignore
  $Row.role = 'row'
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
  for (const [i, process_] of processes.entries()) {
    render$Process($Processes.children[i], process_)
  }
}

const render$ProcessesMore = ($Processes, processes) => {
  for (const [i, process_] of processes.entries()) {
    render$Process($Processes.children[i], process_)
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
  if (!$Tbody) {
    return
  }
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

const Id = {
  id: 1,
  create() {
    return this.id++
  },
}

const callbacks = Object.create(null)

const Callback = {
  registerPromise() {
    const id = Id.create()
    const promise = new Promise((resolve, reject) => {
      callbacks[id] = { resolve, reject }
    })
    return { id, promise }
  },
  resolve(id, message) {
    callbacks[id].resolve(message)
    delete callbacks[id]
  },
}

const JsonRpcVersion = {
  Two: '2.0',
}

const ErrorType = {
  DomException: 'DOMException',
  ReferenceError: 'ReferenceError',
  SyntaxError: 'SyntaxError',
  TypeError: 'TypeError',
}

const GetErrorConstructor = {
  getErrorConstructor(message, type) {
    if (type) {
      switch (type) {
        case ErrorType.DomException:
          return DOMException
        case ErrorType.TypeError:
          return TypeError
        case ErrorType.SyntaxError:
          return SyntaxError
        case ErrorType.ReferenceError:
          return ReferenceError
        default:
          return Error
      }
    }
    if (message.startsWith('TypeError: ')) {
      return TypeError
    }
    if (message.startsWith('SyntaxError: ')) {
      return SyntaxError
    }
    if (message.startsWith('ReferenceError: ')) {
      return ReferenceError
    }
    return Error
  },
}

const constructError = (message, type, name) => {
  const ErrorConstructor = GetErrorConstructor.getErrorConstructor(message, type)
  if (ErrorConstructor === DOMException && name) {
    return new ErrorConstructor(message, name)
  }
  if (ErrorConstructor === Error) {
    const error = new Error(message)
    if (name && name !== 'VError') {
      error.name = name
    }
    return error
  }
  return new ErrorConstructor(message)
}

const JsonRpcErrorCode = {
  MethodNotFound: -32601,
  Custom: -32001,
}

class JsonRpcError extends Error {
  constructor(message) {
    super(message)
    this.name = 'JsonRpcError'
  }
}

const RestoreJsonRpcError = {
  restoreJsonRpcError(error) {
    if (error && error instanceof Error) {
      return error
    }
    if (error && error.code && error.code === JsonRpcErrorCode.MethodNotFound) {
      const restoredError = new JsonRpcError(error.message)
      restoredError.stack = error.stack
      return restoredError
    }
    if (error && error.message) {
      const restoredError = constructError(error.message, error.type, error.name)
      if (error.data) {
        if (error.data.stack) {
          restoredError.stack = error.message + '\n' + error.data.stack

          if (error.data.codeFrame) {
            // @ts-ignore
            restoredError.codeFrame = error.data.codeFrame
          }
        }
      } else if (error.stack) {
        // TODO accessing stack might be slow
        const lowerStack = restoredError.stack
        // @ts-ignore
        const indexNewLine = lowerStack.indexOf('\n')
        // @ts-ignore
        restoredError.stack = error.stack + lowerStack.slice(indexNewLine)
      }
      return restoredError
    }
    if (typeof error === 'string') {
      return new Error(`JsonRpc Error: ${error}`)
    }
    return new Error(`JsonRpc Error: ${error}`)
  },
}

const JsonRpc = {
  async invoke(ipc, method, ...params) {
    const { id, promise } = Callback.registerPromise()
    ipc.send({
      jsonrpc: JsonRpcVersion.Two,
      method,
      params,
      id,
    })
    const responseMessage = await promise
    if ('error' in responseMessage) {
      const restoredError = RestoreJsonRpcError.restoreJsonRpcError(responseMessage.error)
      throw restoredError
    }
    if ('result' in responseMessage) {
      return responseMessage.result
    }

    throw new Error('unexpected response message')
  },
  async invokeAndTransfer(ipc, transfer, method, ...params) {
    const { id, promise } = Callback.registerPromise()
    ipc.sendAndTransfer(
      {
        jsonrpc: JsonRpcVersion.Two,
        method,
        params,
        id,
      },
      transfer,
    )
    const responseMessage = await promise
    if ('error' in responseMessage) {
      const restoredError = RestoreJsonRpcError.restoreJsonRpcError(responseMessage.error)
      throw restoredError
    }
    if ('result' in responseMessage) {
      return responseMessage.result
    }

    throw new Error('unexpected response message')
  },
}

const SharedProcess = {
  /**
   * @type {any}
   */
  ipc: undefined,
  async invoke(method, ...params) {
    return JsonRpc.invoke(this.ipc, method, ...params)
  },
  async invokeAndTransfer(method, transfer, ...params) {
    return JsonRpc.invokeAndTransfer(this.ipc, transfer, method, ...params)
  },
  async listen() {
    this.ipc = await IpcChild.listen({ module: IpcChildWithSharedProcess })
  },
}

const ProcessExplorer = {
  /**
   * @type {any}
   */
  ipc: undefined,
  async invoke(method, ...params) {
    return JsonRpc.invoke(this.ipc, method, ...params)
  },
  async listen() {
    this.ipc = await IpcChild.listen({ module: IpcChildWithProcessExplorer })
  },
}

const listProcessesWithMemoryUsage = (rootPid) => {
  return ProcessExplorer.invoke('ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage', rootPid)
}

const handleMessageFromWindow = (event) => {
  const { data } = event
  if ('method' in data) {
    return
  }
  Callback.resolve(data.id, data)
  window.removeEventListener('message', handleMessageFromWindow)
}

const unwrapJsonRpcResult = (responseMessage) => {
  if ('error' in responseMessage) {
    const restoredError = RestoreJsonRpcError.restoreJsonRpcError(responseMessage.error)
    throw restoredError
  }
  if ('result' in responseMessage) {
    return responseMessage.result
  }
  return undefined
}

const IpcId = {
  ProcessExplorerRenderer: 33,
}

const getPort = async (type, name) => {
  // @ts-ignore
  window.addEventListener('message', handleMessageFromWindow)
  const { id, promise } = Callback.registerPromise()
  const { port1, port2 } = new MessageChannel()
  const message = {
    jsonrpc: JsonRpcVersion.Two,
    id,
    method: 'CreateMessagePort.createMessagePort',
    params: [IpcId.ProcessExplorerRenderer],
  }
  // @ts-ignore
  if (!globalThis.isElectron) {
    throw new Error('Electron api was requested but is not available')
  }
  window.postMessage(message, '*', [port1])
  const responseMessage = await promise
  unwrapJsonRpcResult(responseMessage)
  return port2
}

const IpcChildWithSharedProcess = {
  async create() {
    const port = await getPort('shared-process', 'Shared Process')
    return port
  },
  wrap(port) {
    return {
      port,
      /**
       * @type {any}
       */
      wrappedListener: null,
      send(message) {
        this.port.postMessage(message)
      },
      sendAndTransfer(message, transfer) {
        this.port.postMessage(message, transfer)
      },
      set onmessage(listener) {
        this.wrappedListener = (event) => {
          listener(event.data)
        }
        this.port.onmessage = this.wrappedListener
      },
      get onmessage() {
        return this.wrappedListener
      },
    }
  },
}

const IpcChildWithProcessExplorer = {
  async create() {
    const { port1, port2 } = new MessageChannel()
    await SharedProcess.invokeAndTransfer('HandleMessagePortForProcessExplorer.handleMessagePortForProcessExplorer', [port1])
    return port2
  },
  wrap(port) {
    return {
      port,
      /**
       * @type {any}
       */
      wrappedListener: null,
      send(message) {
        this.port.postMessage(message)
      },
      set onmessage(listener) {
        this.wrappedListener = (event) => {
          listener(event.data)
        }
        this.port.onmessage = this.wrappedListener
      },
      get onmessage() {
        return this.wrappedListener
      },
    }
  },
}

const IpcChild = {
  async listen({ module }) {
    const rawIpc = await module.create()
    const ipc = module.wrap(rawIpc)
    HandleIpc.handleIpc(ipc)
    return ipc
  },
}

const handleError = (event) => {
  console.error(event)
  document.body.textContent = `${event}`
}

const handleUnhandledRejection = (event) => {
  console.error(event.reason)
  document.body.textContent = `${event.reason}`
}

const isResultMessage = (message) => {
  return 'result' in message
}

const isErrorMessage = (message) => {
  return 'error' in message
}

const Signal = {
  SIGTERM: 'SIGTERM',
}

const Process = {
  kill(pid) {
    return ProcessExplorer.invoke('Process.kill', pid, Signal.SIGTERM)
  },
  debug(pid) {
    // TODO
    console.log({ pid })
  },
}

const getContextMenuFn = (label) => {
  switch (label) {
    case 'Kill Process':
      return Process.kill
    case 'Debug Process':
      return Process.debug
    default:
      throw new Error(`context menu function not found ${label}`)
  }
}

const ElectronContextMenu = {
  handleSelect(label, customData) {
    const { pid } = customData
    const fn = getContextMenuFn(label)
    return fn(pid)
  },
}

const CommandMap = {
  commandMap: {
    'ElectronContextMenu.handleSelect': ElectronContextMenu.handleSelect,
  },
}

const Command = {
  execute(method, ...params) {
    const fn = CommandMap.commandMap[method]
    if (!fn) {
      return
    }
    return fn(...params)
  },
}

const handleMessage = (message) => {
  if (message.id && (isResultMessage(message) || isErrorMessage(message))) {
    Callback.resolve(message.id, message)
    return
  }
  if (message.method) {
    return Command.execute(message.method, ...message.params)
  }
}

const getPid = () => {
  return ProcessExplorer.invoke('ProcessId.getMainProcessId')
}

const sleep = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

const HandleIpc = {
  handleIpc(ipc) {
    ipc.onmessage = handleMessage
  },
}

const main = async () => {
  onerror = handleError
  onunhandledrejection = handleUnhandledRejection
  await SharedProcess.listen()
  await ProcessExplorer.listen()
  const pid = await getPid()
  const refreshInterval = 1000
  while (true) {
    const processesWithMemoryUsage = await listProcessesWithMemoryUsage(pid)
    renderProcesses(processesWithMemoryUsage)
    await sleep(refreshInterval)
  }
}

main()
