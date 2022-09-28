import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Timestamp from '../Timestamp/Timestamp.js'
export { create as Locator } from './Locator.js'

export const getTmpDir = async () => {
  return `memfs://`
}

const waitForReady = async () => {
  //   const startTime = Time.getTimeStamp()
  //   const endTime = startTime + maxTimeout
  //   let currentTime = startTime
  //   while (currentTime < endTime) {
  //     const element = querySelectorWithOptions(
  //       '.ActivityBarItem[title="Explorer"]'
  //     )
  //     if (element) {
  //       return
  //     }
  //     await Timeout.waitForMutation(100)
  //     currentTime = Time.getTimeStamp()
  //   }
  // throw new Error(`Main element not found`)
}

const printError = (error) => {
  if (error && error.constructor.name === 'AssertionError') {
    console.error(error.message)
  } else {
    console.error(error)
  }
}

export const test = async (name, fn) => {
  NameAnonymousFunction.nameAnonymousFunction(fn, `test/${name}`)
  let _error
  let _start
  let _end
  let _duration
  try {
    await waitForReady()
    _start = Timestamp.now()
    await fn()
    _end = Timestamp.now()
    _duration = `${_end - _start}ms`
    console.info(`[test passed] ${name} in ${_duration}`)
  } catch (error) {
    console.log({ error })
    _error = error.message
    error.message = `Test failed: ${name}: ${error.message}`
    printError(error)
  }
  let state
  let background
  let text
  if (_error) {
    state = 'fail'
    background = 'red'
    text = `test failed: ${_error}`
  } else {
    background = 'green'
    text = `test passed in ${_duration}`
    state = 'pass'
  }
  await RendererProcess.invoke(
    'TestFrameWork.showOverlay',
    state,
    background,
    text
  )
}

test.skip = async (id, fn) => {
  const state = 'skip'
  const background = 'yellow'
  const text = `test skipped ${id}`
  await RendererProcess.invoke(
    'TestFrameWork.showOverlay',
    state,
    background,
    text
  )
}

const Assert = {
  string(value, message) {
    if (typeof value !== 'string') {
      throw new Error(message)
    }
  },
  number(value, message) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error(message)
    }
  },
}

export const expect = (locator) => {
  return {
    async checkSingleElementCondition(fnName, options) {
      Assert.string(fnName)
      return RendererProcess.invoke(
        'TestFrameWork.checkSingleElementCondition',
        locator,
        fnName,
        options
      )
    },
    async checkMultiElementCondition(fnName, options) {
      return RendererProcess.invoke(
        'TestFrameWork.checkMultiElementCondition',
        locator,
        fnName,
        options
      )
    },
    async toBeVisible() {
      if (this.negated) {
        throw new Error(`use toBeHidden instead of not.toBeVisible`)
      }
      return this.checkSingleElementCondition('toBeVisible', {})
    },
    async toHaveText(text) {
      Assert.string(text, 'text must be of type string')
      return this.checkSingleElementCondition('toHaveText', { text })
    },
    async toHaveValue(value) {
      Assert.string(value, 'value must be of type string')
      return this.checkSingleElementCondition('toHaveValue', { value })
    },
    async toBeFocused() {
      return this.checkSingleElementCondition('toBeFocused')
    },
    async toHaveCSS(key, value) {
      return this.checkSingleElementCondition('toHaveCss', {
        key,
        value,
      })
    },
    async toHaveAttribute(key, value) {
      Assert.string(key, 'key must be of type string')
      // Assert.string(value, 'value must be of type string')
      return this.checkSingleElementCondition('toHaveAttribute', {
        key,
        value,
      })
    },
    async toHaveClass(className) {
      Assert.string(className, 'className must be of type string')
      return await this.checkSingleElementCondition('toHaveClass', {
        className,
      })
    },
    async toHaveId(id) {
      Assert.string(id, 'id must be of type string')
      return await this.checkSingleElementCondition('toHaveId', {
        id,
      })
    },
    async toHaveCount(count) {
      Assert.number(count, 'count must be of type string')
      return this.checkMultiElementCondition('toHaveCount', { count })
    },
    async toBeHidden() {
      return this.checkMultiElementCondition('toBeHidden', {})
    },
    get not() {
      this.negated = true
      return this
    },
  }
}
