import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const checkSingleElementCondition = (locator, fnName, options) => {
  return RendererProcess.invoke('TestFrameWork.checkSingleElementCondition', locator, fnName, options)
}

export const checkMultiElementCondition = (locator, fnName, options) => {
  return RendererProcess.invoke('TestFrameWork.checkMultiElementCondition', locator, fnName, options)
}

export const showOverlay = (...args) => {
  return RendererProcess.invoke('TestFrameWork.showOverlay', ...args)
}

export const performAction = (...args) => {
  return RendererProcess.invoke('TestFrameWork.performAction', ...args)
}

export const checkConditionError = (...args) => {
  return RendererProcess.invoke('TestFrameWork.checkConditionError', ...args)
}
