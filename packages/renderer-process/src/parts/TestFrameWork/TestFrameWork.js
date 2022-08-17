import * as ElementActions from './ElementActions.js'
import * as QuerySelector from './QuerySelector.js'
import * as SingleElementConditions from './SingleElementConditions.js'
import * as MultiElementConditions from './MultiElementConditions.js'
import * as ConditionErrors from './ConditionErrors.js'
import * as Assert from '../Assert/Assert.js'
import * as KeyBoardActions from './KeyBoardActions.js'

const create$Overlay = () => {
  const $TestOverlay = document.createElement('div')
  $TestOverlay.id = 'TestOverlay'
  $TestOverlay.style.position = 'fixed'
  $TestOverlay.style.bottom = '0px'
  $TestOverlay.style.left = '0px'
  $TestOverlay.style.right = '0px'
  $TestOverlay.style.height = '20px'
  $TestOverlay.style.whiteSpace = 'nowrap'
  $TestOverlay.style.contain = 'strict'
  $TestOverlay.style.userSelect = 'text'
  return $TestOverlay
}

export const showOverlay = (state, background, text) => {
  const $TestOverlay = create$Overlay()
  $TestOverlay.dataset.state = state
  $TestOverlay.style.background = background
  $TestOverlay.textContent = text
  document.body.append($TestOverlay)
}

const Time = {
  getTimeStamp() {
    return performance.now()
  },
}

const maxTimeout = 2000

const Timeout = {
  async short() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  },
  async waitForMutation(maxDelay) {
    const disposables = []
    await Promise.race([
      new Promise((resolve) => {
        const timeout = setTimeout(resolve, maxDelay)
        disposables.push(() => {
          clearTimeout(timeout)
        })
      }),
      new Promise((resolve) => {
        const callback = (mutations) => {
          resolve(undefined)
        }
        const observer = new MutationObserver(callback)
        observer.observe(document.body, {
          childList: true,
          attributes: true,
          characterData: true,
          subtree: true,
          attributeOldValue: true,
          characterDataOldValue: true,
        })
        disposables.push(() => {
          observer.disconnect()
        })
      }),
    ])
    for (const disposable of disposables) {
      disposable()
    }
  },
}

export const performAction = async (locator, fnName, options) => {
  Assert.object(locator)
  Assert.string(fnName)
  Assert.object(options)
  const startTime = Time.getTimeStamp()
  const endTime = startTime + maxTimeout
  let currentTime = startTime
  const fn = ElementActions[fnName]
  while (currentTime < endTime) {
    const element = QuerySelector.querySelectorWithOptions(locator._selector, {
      hasText: locator._hasText,
      nth: locator._nth,
    })
    if (element) {
      fn(element, options)
      return
    }
    await Timeout.waitForMutation(100)
    currentTime = Time.getTimeStamp()
  }
}

export const performKeyBoardAction = (fnName, options) => {
  const fn = KeyBoardActions[fnName]
  fn(options)
}

export const checkSingleElementCondition = async (locator, fnName, options) => {
  const startTime = Time.getTimeStamp()
  const endTime = startTime + maxTimeout
  let currentTime = startTime
  const fn = SingleElementConditions[fnName]
  while (currentTime < endTime) {
    const element = QuerySelector.querySelectorWithOptions(locator._selector, {
      hasText: locator._hasText,
      nth: locator._nth,
    })
    if (element) {
      const successful = fn(element, options)
      if (successful) {
        return
      }
    }
    await Timeout.waitForMutation(100)
    currentTime = Time.getTimeStamp()
  }
  const message = ConditionErrors[fn.name](locator, options)
  throw new Error(message)
}

export const checkMultiElementCondition = async (locator, fnName, options) => {
  const startTime = Time.getTimeStamp()
  const endTime = startTime + maxTimeout
  let currentTime = startTime
  const fn = MultiElementConditions[fnName]
  while (currentTime < endTime) {
    const elements = QuerySelector.querySelector(locator._selector)
    const successful = fn(elements, options)
    if (successful) {
      return
    }
    await Timeout.waitForMutation(100)
    currentTime = Time.getTimeStamp()
  }
  const message = ConditionErrors[fn.name](locator, options)
  throw new Error(message)
}
