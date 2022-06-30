import * as Widget from '../Widget/Widget.js'
import * as Focus from '../Focus/Focus.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const state = {
  $Dialog: undefined,
}

// TODO in the future, new file creation should be in explorer like in vscode
// workaround for electron bug https://github.com/electron/electron/issues/472
const showDialogInsteadOfPrompt = true

export const prompt = async (message) => {
  if (showDialogInsteadOfPrompt) {
    const $Dialog = document.createElement('dialog')
    $Dialog.id = 'Dialog'
    const $DialogTitle = document.createElement('h1')
    const $DialogInput = document.createElement('input')
    const $DialogButtonOk = document.createElement('button')
    $DialogButtonOk.textContent = 'ok'
    const $DialogButtonCancel = document.createElement('button')
    $DialogButtonCancel.textContent = 'Cancel'
    $Dialog.append(
      $DialogTitle,
      $DialogInput,
      $DialogButtonCancel,
      $DialogButtonOk
    )
    $DialogTitle.textContent = message
    Widget.append($Dialog)
    // @ts-ignore
    $Dialog.showModal()
    Focus.setFocus('dialog')
    state.$Dialog = $Dialog
    // TODO what if there is an error inside the body of the promise function?
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        $DialogButtonOk.onclick = undefined
        $DialogButtonCancel.onclick = undefined
        $Dialog.remove()
      }
      const handleOk = () => {
        console.log('ok clicked')
        cleanup()
        resolve($DialogInput.value)
      }
      const handleCancel = () => {
        console.log('cancel clicked')
        cleanup()
        resolve(undefined)
      }
      $DialogButtonOk.onclick = handleOk
      $DialogButtonCancel.onclick = handleCancel
      // TODO support escape key to close modal and cancel
    })
  }
  const result = window.prompt(message)
  return result
}

export const alert = (message) => {
  console.log('actual alert', message)
  window.alert(message)
  // globalThis.alert(`message ${message}`)
  // globalThis.alert('odijdiej')
}

export const close = () => {
  console.log('dialog removed')
  Widget.remove(state.$Dialog)
  state.$Dialog = undefined
  Focus.focusPrevious()
}

const RE_STACK_1 = /\((.*):(\d+):(\d+)\)$/
const RE_STACK_2 = /at (.*):(\d+):(\d+)$/

const create$ErrorStack = (stack) => {
  const $DialogBodyErrorStack = document.createElement('div')
  $DialogBodyErrorStack.id = 'DialogBodyErrorStack'
  $DialogBodyErrorStack.textContent = stack

  // TODO chrome doesn't allow local file links,
  // should probably open editor with that file in new tab?
  //   let match = stackLine.match(RE_STACK_1)
  //   if (!match) {
  //     match = stackLine.match(RE_STACK_2)
  //   }
  //   if (match) {
  //     const [_, path, line, column] = match
  //     console.log({ match })
  //     const $Line = document.createElement('div')
  //     const $Link = document.createElement('a')
  //     $Link.setAttribute('target', 'noopener noreferrer')
  //     $Link.setAttribute('target', 'blank')
  //     $Link.textContent = path
  //     $Link.href = path
  //     $Line.append($Link)
  //     $Lines.append($Line)
  //   } else {
  //     const $Line = document.createElement('div')
  //     $Line.className = 'StackLine'
  //     $Line.textContent = stackLine
  //     $Lines.append($Line)
  //   }
  // }
  return $DialogBodyErrorStack
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const handleDialogOptionClick = (event) => {
  const $Target = event.target
  const index = getNodeIndex($Target)
  RendererWorker.send([
    /* Dialog.handleClick */ 'Dialog.handleClick',
    /* index */ index,
  ])
}

// TODO this show be a viewlet
export const showErrorDialogWithOptions = (error, options) => {
  if (!Platform.supportsHtml5Dialog()) {
    console.info('the dialog api is not available on this browser')
    alert(error) // TODO in electron this will do nothing, but electron always supports dialogs
    return
  }
  options ||= [] // TODO options should always be defined

  const $DialogTitle = document.createElement('h2')
  $DialogTitle.id = 'DialogTitle'
  $DialogTitle.textContent = error.category || 'Extension Error'

  const $DialogBodyErrorMessage = document.createElement('p')
  $DialogBodyErrorMessage.id = 'DialogBodyErrorMessage'
  if (typeof error === 'string') {
    $DialogBodyErrorMessage.textContent = error
  } else {
    $DialogBodyErrorMessage.textContent = error.message
  }

  const $DialogBodyErrorCodeFrame = document.createElement('code')
  $DialogBodyErrorCodeFrame.id = 'DialogBodyErrorCodeFrame'
  $DialogBodyErrorCodeFrame.textContent = error.codeFrame
  $DialogBodyErrorCodeFrame.ariaLabel = 'Code Frame'

  const $DialogBodyErrorStack = create$ErrorStack(error.stack)

  const $DialogBodyOptions = document.createElement('div')
  $DialogBodyOptions.id = 'DialogBodyOptions'

  for (const option of options) {
    const $DialogOption = document.createElement('button')
    $DialogOption.className = 'DialogOption'
    $DialogOption.textContent = option
    $DialogOption.onclick = handleDialogOptionClick
    $DialogBodyOptions.append($DialogOption)
  }
  const $DialogBody = document.createElement('div')
  $DialogBody.id = 'DialogBody'
  $DialogBody.append(
    $DialogBodyErrorMessage,
    $DialogBodyErrorCodeFrame,
    $DialogBodyErrorStack,
    $DialogBodyOptions
  )
  // TODO screen reader switches to browse mode for dialog and
  // reads dialog title and error message multiple times
  const $Dialog = document.createElement('dialog')
  $Dialog.id = 'Dialog'
  $Dialog.setAttribute('aria-labelledby', 'DialogTitle')
  $Dialog.setAttribute('aria-describedby', 'DialogBodyErrorMessage')
  $Dialog.append($DialogTitle, $DialogBody)
  Widget.append($Dialog)
  // @ts-ignore
  $Dialog.showModal()
  Focus.setFocus('dialog')
  state.$Dialog = $Dialog
}
