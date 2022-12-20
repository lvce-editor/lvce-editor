import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const handleClickContinue = () => {
  RendererWorker.send('Run And Debug.continue')
}

const handleClickPause = (event) => {
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

const handleClickPauseContinue = (event, target) => {
  event.preventDefault()
  console.log(target.textContent)
  switch (target.textContent) {
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
    case 'DebugButton':
      handleClickPauseContinue(event, target)
      break
    case 'DebugSectionHeader':
      handleClickDebugSectionHeader(event, target)
      break
    default:
      break
  }
}
