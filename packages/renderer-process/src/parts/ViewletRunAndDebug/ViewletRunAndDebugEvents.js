import * as Event from '../Event/Event.js'
import * as Focus from '../Focus/Focus.js'
import * as ViewletRunAndDebugFunctions from './ViewletRunAndDebugFunctions.js'

// TODO rename to resume
const handleClickContinue = () => {
  ViewletRunAndDebugFunctions.handleContinue()
}

const handleClickPause = (event) => {
  ViewletRunAndDebugFunctions.pause()
}

const handleClickStepOver = (event) => {
  ViewletRunAndDebugFunctions.stepOver()
}

const handleClickStepInto = (event) => {
  ViewletRunAndDebugFunctions.stepInto()
}

const handleClickStepOut = (event) => {
  ViewletRunAndDebugFunctions.stepOut()
}

const handleClickDebugButton = (event, target) => {
  Event.preventDefault(event)
  switch (target.title) {
    case 'Pause':
      handleClickPause()
      break
    case 'Resume':
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
  ViewletRunAndDebugFunctions.handleClickSectionWatch()
}

const handleClickSectionBreakpoints = () => {
  ViewletRunAndDebugFunctions.handleClickSectionBreakpoints()
}

const handleClickSectionScope = () => {
  ViewletRunAndDebugFunctions.handleClickSectionScope()
}

const handleClickSectionCallstack = () => {
  ViewletRunAndDebugFunctions.handleClickSectionCallstack()
}

const handleClickDebugSectionHeader = (event, target) => {
  Event.preventDefault(event)
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

export const handlePointerDown = (event) => {
  const { target } = event
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
  ViewletRunAndDebugFunctions.handleDebugInput(value)
}
