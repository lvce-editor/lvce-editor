import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'
import * as ViewletRunAndDebugFunctions from './ViewletRunAndDebugFunctions.ts'

export const handleClickContinue = () => {
  ViewletRunAndDebugFunctions.handleContinue()
}

export const handleClickPause = (event) => {
  ViewletRunAndDebugFunctions.pause()
}

export const handleClickStepOver = (event) => {
  ViewletRunAndDebugFunctions.stepOver()
}

export const handleClickStepInto = (event) => {
  ViewletRunAndDebugFunctions.stepInto()
}

export const handleClickStepOut = (event) => {
  ViewletRunAndDebugFunctions.stepOut()
}

export const handleClickSectionWatch = () => {
  ViewletRunAndDebugFunctions.handleClickSectionWatch()
}

export const handleClickSectionBreakpoints = () => {
  ViewletRunAndDebugFunctions.handleClickSectionBreakpoints()
}

export const handleClickSectionScope = () => {
  ViewletRunAndDebugFunctions.handleClickSectionScope()
}

export const handleClickSectionCallstack = () => {
  ViewletRunAndDebugFunctions.handleClickSectionCallstack()
}

export const handleDebugInputFocus = () => {
  RendererWorker.send('Focus.setFocus', WhenExpression.FocusDebugInput)
}

export const handleClickScopeValue = (event) => {
  const { target } = event
  const { textContent } = target
  ViewletRunAndDebugFunctions.handleClickScopeValue(textContent)
}

export const handleDebugInput = (event) => {
  const { target } = event
  const { value } = target
  ViewletRunAndDebugFunctions.handleDebugInput(value)
}
