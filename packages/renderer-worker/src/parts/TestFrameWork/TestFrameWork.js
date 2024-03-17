import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const checkSingleElementCondition = (locator, fnName, options) => {
  return RendererProcess.invoke('TestFrameWork.checkSingleElementCondition', locator, fnName, options)
}

export const checkMultiElementCondition = (locator, fnName, options) => {
  return RendererProcess.invoke('TestFrameWork.checkMultiElementCondition', locator, fnName, options)
}
