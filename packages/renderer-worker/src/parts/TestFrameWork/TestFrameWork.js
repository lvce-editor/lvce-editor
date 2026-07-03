import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const defaultTimeout = 1000
const interval = 50

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const checkCondition = async (method, locator, fnName, options) => {
  const timeout = options?.timeout ?? defaultTimeout
  const deadline = Date.now() + timeout
  while (true) {
    const result = await RendererProcess.invoke(method, locator, fnName, options)
    if (!result?.error || Date.now() >= deadline) {
      return result
    }
    await delay(interval)
  }
}

export const checkSingleElementCondition = (locator, fnName, options) => {
  return checkCondition('TestFrameWork.checkSingleElementCondition', locator, fnName, options)
}

export const checkMultiElementCondition = (locator, fnName, options) => {
  return checkCondition('TestFrameWork.checkMultiElementCondition', locator, fnName, options)
}

export const showOverlay = (...args) => {
  return RendererProcess.invoke('TestFrameWork.showOverlay', ...args)
}

export const showTestResults = (...args) => {
  return RendererProcess.invoke('TestFrameWork.showTestResults', ...args)
}

export const performAction = (...args) => {
  return RendererProcess.invoke('TestFrameWork.performAction', ...args)
}

export const performKeyBoardAction = (...args) => {
  return RendererProcess.invoke('TestFrameWork.performKeyBoardAction', ...args)
}

export const checkConditionError = (...args) => {
  return RendererProcess.invoke('TestFrameWork.checkConditionError', ...args)
}
