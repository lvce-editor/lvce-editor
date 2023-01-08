import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Focus from '../Focus/Focus.js'

const handleClickContinue = () => {
  RendererWorker.send('Run And Debug.continue')
}

const handleClickPause = (event) => {
  console.log('pause debugger')
  RendererWorker.send('Run And Debug.pause')
}

const handleClickStepOver = (event) => {
  console.log('step over')
  RendererWorker.send('Run And Debug.stepOver')
}

const handleClickStepInto = (event) => {
  RendererWorker.send('Run And Debug.stepInto')
}

const handleClickStepOut = (event) => {
  RendererWorker.send('Run And Debug.stepOut')
}

const handleClickDebugButton = (event, target) => {
  event.preventDefault()
  switch (target.ariaLabel) {
    case 'pause':
      handleClickPause()
      break
    case 'continue':
      handleClickContinue()
      break
    case 'Step over':
      handleClickStepOver()
      break
    case 'Step into':
      handleClickStepInto()
      break
    case 'Step out':
      handleClickStepOut()
      break
    default:
      console.log(target)
      break
  }
}

const handleClickSectionWatch = () => {
  RendererWorker.send('Run And Debug.handleClickSectionWatch')
}

const handleClickSectionBreakpoints = () => {
  RendererWorker.send('Run And Debug.handleClickSectionBreakPoints')
}

const handleClickSectionScope = () => {
  RendererWorker.send('Run And Debug.handleClickSectionScope')
}

const handleClickSectionCallstack = () => {
  RendererWorker.send('Run And Debug.handleClickSectionCallstack')
}

const handleClickDebugSectionHeader = (event, target) => {
  event.preventDefault()
  switch (target.textContent) {
    case 'Watch':
      handleClickSectionWatch()
      break
    case 'BreakPoints':
      handleClickSectionBreakpoints()
      break
    case 'Scope':
      handleClickSectionScope()
      break
    case 'Call Stack':
      handleClickSectionCallstack()
      break
    default:
      break
  }
}

export const handleMouseDown = (event) => {
  const { target } = event
  console.log(target.className)
  switch (target.className) {
    case 'IconButton DebugButton':
      handleClickDebugButton(event, target)
      break
    case 'DebugSectionHeader':
      handleClickDebugSectionHeader(event, target)
      break
    default:
      break
  }
}

export const handleDebugInputFocus = () => {
  Focus.setFocus('DebugInput')
}

export const handleDebugInput = (event) => {
  const { target } = event
  const { value } = target
  RendererWorker.send('Run And Debug.handleDebugInput', value)
}
