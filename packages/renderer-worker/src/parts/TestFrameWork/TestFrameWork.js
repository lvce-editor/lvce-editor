import * as Command from '../Command/Command.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
export { create as Locator } from './Locator.js'

export const getTmpDir = async () => {
  return `memfs://`
}

const querySelectorByText = (root, text) => {
  let node
  const elements = []
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
  while ((node = walk.nextNode())) {
    // @ts-ignore
    if (node.nodeValue === text) {
      elements.push(node.parentNode)
    }
  }
  return elements
}

const querySelectorByCss = (selector) => {
  return Array.from(document.querySelectorAll(selector))
}

const querySelector = (selector) => {
  if (typeof selector !== 'string') {
    throw new Error('selector must be of type string')
  }
  if (selector.startsWith('text=')) {
    return querySelectorByText(document.body, selector.slice('text='.length))
  }
  if (selector.includes('text=')) {
    const index = selector.indexOf('text=')
    const elements = querySelectorByCss(selector.slice(0, index))
    const text = selector.slice(index + 'text='.length)
    return elements.flatMap((element) => {
      return querySelectorByText(element, text)
    })
    // for(const element of elements)
  }
  if (selector.startsWith('.')) {
    return querySelectorByCss(selector)
  }
  if (selector.startsWith('#')) {
    return querySelectorByCss(selector)
  }
  throw new Error(`unsupported selector: ${selector}`)
}

const querySelectorWithOptions = (
  selector,
  { nth = -1, hasText = '' } = {}
) => {
  let elements = querySelector(selector)
  if (hasText) {
    elements = elements.filter((element) => element.textContent === hasText)
  }
  if (elements.length === 0) {
    return undefined
  }
  if (elements.length === 1) {
    const element = elements[0]
    return element
  }
  if (nth === -1) {
    throw new Error(`too many matching elements for ${selector}`)
  }
  const element = elements[nth]
  if (!element) {
    throw new Error(`selector not found: ${selector}`)
  }
  return element
}

const getKeyOptions = (rawKey) => {
  if (rawKey.includes('+')) {
    const parts = rawKey.split('+')
    let ctrlKey = false
    let altKey = false
    let spaceKey = false
    let key = ''
    for (const part of parts) {
      switch (part) {
        case 'Control':
          ctrlKey = true
          break
        case 'Space':
          key = ' '
          break
        case 'Alt':
          altKey = true
          break
        default:
          key = part
          break
      }
    }
    return {
      key,
      ctrlKey,
      altKey,
    }
  }
  return { key: rawKey }
}

const createKeyBoard = () => {
  return {
    async press(key) {
      const element = document.activeElement
      const keyOptions = getKeyOptions(key)
      const options = {
        cancelable: true,
        bubbles: true,
        ...keyOptions,
      }
      ElementActions.keyDown(element, options)
      ElementActions.keyUp(element, options)
    },
  }
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

export const test = async (name, fn) => {
  let _error
  let _start
  let _end
  let _duration
  try {
    await waitForReady()
    _start = performance.now()
    await fn()
    _end = performance.now()
    _duration = `${_end - _start}ms`
    console.info(`[test passed] ${name} in ${_duration}`)
  } catch (error) {
    _error = error.message
    error.message = `Test failed: ${name}: ${error.message}`
    console.error(error)
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

test.skip = (id, fn) => {
  const $TestOverlay = createOverlay()
  $TestOverlay.textContent = 'test skipped'
  $TestOverlay.dataset.state = 'skip'
  document.body.append($TestOverlay)
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
      return this.checkSingleElementCondition('toBeVisible', {})
    },
    async toHaveText(text) {
      Assert.string(text, 'text must be of type string')
      return this.checkSingleElementCondition('toHaveText', { text })
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
