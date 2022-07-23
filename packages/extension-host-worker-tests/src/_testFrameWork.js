const URL_RENDERER_WORKER =
  '/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js'

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

const ElementActions = {
  mouseEvent(element, eventType, options) {
    const event = new MouseEvent(eventType, options)
    element.dispatchEvent(event)
  },
  mouseDown(element, options) {
    ElementActions.mouseEvent(element, 'mousedown', options)
  },
  mouseUp(element, options) {
    ElementActions.mouseEvent(element, 'mouseup', options)
  },
  contextMenu(element, options) {
    ElementActions.mouseEvent(element, 'contextmenu', options)
  },
  click(element, options) {
    ElementActions.mouseDown(element, options)
    ElementActions.mouseEvent(element, 'click', options)
    ElementActions.mouseUp(element, options)
    if (options.button === 2 /* right */) {
      ElementActions.contextMenu(element, options)
    }
  },
  hover(element, options) {
    ElementActions.mouseEvent(element, 'mouseenter', options)
  },
  type(element, options) {
    element.value = options.text
  },
  keyboardEvent(element, eventType, options) {
    const event = new KeyboardEvent(eventType, options)
    element.dispatchEvent(event)
  },
  keyDown(element, options) {
    ElementActions.keyboardEvent(element, 'keydown', options)
  },
  keyUp(element, options) {
    ElementActions.keyboardEvent(element, 'keyup', options)
  },
}

const toButtonNumber = (buttonType) => {
  switch (buttonType) {
    case 'left':
      return 0
    case 'middle':
      return 1
    case 'right':
      return 2
    default:
      throw new Error(`unsupported button type: ${buttonType}`)
  }
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

const createLocator = (selector, { nth = -1, hasText = '' } = {}) => {
  return {
    selector,
    options: {
      nth,
      hasText,
    },
    async performAction(fn, options) {
      const startTime = Time.getTimeStamp()
      const endTime = startTime + maxTimeout
      let currentTime = startTime
      while (currentTime < endTime) {
        const element = querySelectorWithOptions(selector, {
          hasText,
          nth,
        })
        if (element) {
          fn(element, options)
          return
        }
        await Timeout.waitForMutation(100)
        currentTime = Time.getTimeStamp()
      }
      throw new Error(`selector not found: ${selector}`)

      // console.log({ clickOptions })
      // ElementActions.click(element, clickOptions)
      // TODO
    },
    async click({ button = 'left' } = {}) {
      const options = {
        cancable: true,
        bubbles: true,
        button: toButtonNumber(button),
        detail: 1,
      }
      return this.performAction(ElementActions.click, options)
    },
    async hover() {
      const options = {
        cancable: true,
        bubbles: true,
      }
      return this.performAction(ElementActions.hover, options)
    },
    first() {
      return createLocator(selector, {
        nth: 0,
      })
    },
    locator(subSelector) {
      return createLocator(`${selector} ${subSelector}`)
    },
    nth(nth) {
      return createLocator(selector, { nth })
    },
    async type(text) {
      const options = { text }
      return this.performAction(ElementActions.type, options)
    },
  }
}

const getKeyOptions = (rawKey) => {
  if (rawKey.includes('+')) {
    const parts = rawKey.split('+')
    let ctrlKey = false
    let altKey = false
    let spaceKey = false
    let key = ''
    console.log({ parts })
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
      console.log('press', key)
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

const createPage = () => {
  return {
    locator(selector, options) {
      return createLocator(selector, options)
    },
    keyboard: createKeyBoard(),
  }
}

const getRendererWorker = async () => {
  const RendererWorker = await import(URL_RENDERER_WORKER)
  if (typeof RendererWorker.send !== 'function') {
    throw new Error('RendererWorker could not be loaded')
  }
  return RendererWorker
}

export const runWithExtension = async (options) => {
  await new Promise((resolve) => {
    requestIdleCallback(resolve)
  })
  const RendererWorker = await getRendererWorker()
  if (options.name) {
    // TODO should implement rendererWorker.invoke here
    // TODO ask renderer worker to activate this extension
    const absolutePath = new URL(`../fixtures/${options.name}`, location.href)
      .href
    RendererWorker.send('ExtensionMeta.addWebExtension', absolutePath)
  }
  if (options.folder) {
    // TODO ask renderer worker to open this folder
    RendererWorker.send('Workspace.setPath', options.folder)
  }
  const page = createPage()
  return page
}

export const test = async (name, fn) => {
  let _error
  let _start
  let _end
  let _duration
  try {
    if (!globalThis.__codeLoaded) {
      await new Promise((resolve) => {
        window.addEventListener('code/ready', resolve, { once: true })
      })
    }
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
  const $TestOverlay = document.createElement('div')
  $TestOverlay.id = 'TestOverlay'
  $TestOverlay.style.position = 'fixed'
  $TestOverlay.style.bottom = '0px'
  $TestOverlay.style.left = '0px'
  $TestOverlay.style.right = '0px'
  $TestOverlay.style.height = '20px'
  $TestOverlay.style.whiteSpace = 'nowrap'
  $TestOverlay.style.contain = 'strict'
  if (_error) {
    $TestOverlay.dataset.state = 'fail'
    $TestOverlay.style.background = 'red'
    $TestOverlay.textContent = `test failed: ${_error}`
  } else {
    $TestOverlay.style.background = 'green'
    $TestOverlay.textContent = `test passed in ${_duration}`
    $TestOverlay.dataset.state = 'pass'
  }
  document.body.append($TestOverlay)
}

const Conditions = {
  toBeVisible(element) {
    return element.isVisible()
  },

  toHaveText(element, { text }) {
    return element.textContent === text
  },
  toHaveAttribute(element, { key, value }) {
    const attribute = element.getAttribute(key)
    console.log({ key, attribute, value })
    return attribute === value
  },
  toBeFocused(element) {
    console.log({ element })
    return element === document.activeElement
  },
  toHaveClass(element, { className }) {
    console.log({ element, className: element.className, expected: className })
    console.log(element.classList.contains('Focused'))
    return element.classList.contains(className)
  },
  toHaveCss(element, { key, value }) {
    const style = getComputedStyle(element)
    return style[key] === value
  },
}

const MultiElementConditions = {
  toHaveCount(elements, { count }) {
    return elements.length === count
  },
  toBeHidden(elements) {
    return elements.length === 0
  },
}

const ConditionErrors = {
  toBeVisible(locator) {
    return `expected selector to be visible ${locator.selector}`
  },
  toHaveText(locator, { text }) {
    return `expected selector to have text ${locator.selector} ${text}`
  },
  toHaveAttribute(locator, { key, value }) {
    return `expected ${locator.selector} to have attribute ${key} ${value}`
  },
  toHaveCount(locator, { count }) {
    return `expected ${locator.selector} to have count ${count}`
  },
  toBeFocused(locator) {
    return `expected ${locator.selector} to be focused`
  },
  toHaveClass(locator, { className }) {
    return `expected ${locator.selector} to have class ${className}`
  },
  toBeHidden(locator) {
    return `expected ${locator.selector} to be hidden`
  },
  toHaveCss(locator, { key, value }) {
    const [element] = querySelector(locator.selector)
    if (!element) {
      return `expected ${locator.selector} to have css ${key} ${value}`
    }
    const style = getComputedStyle(element)
    const actual = style[key]
    return `expected ${locator.selector} to have css ${key} ${value} but was ${actual}`
  },
}

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

const maxTimeout = 2000

const Time = {
  getTimeStamp() {
    return performance.now()
  },
}

export const expect = (locator) => {
  return {
    async checkSingleElementCondition(fn, options) {
      const startTime = Time.getTimeStamp()
      const endTime = startTime + maxTimeout
      let currentTime = startTime
      while (currentTime < endTime) {
        const element = querySelectorWithOptions(
          locator.selector,
          locator.options
        )
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
    },
    async checkMultiElementCondition(fn, options) {
      const startTime = Time.getTimeStamp()
      const endTime = startTime + maxTimeout
      let currentTime = startTime
      while (currentTime < endTime) {
        const elements = querySelector(locator.selector)
        const successful = fn(elements, options)
        if (successful) {
          return
        }
        await Timeout.waitForMutation(100)
        currentTime = Time.getTimeStamp()
      }
      const message = ConditionErrors[fn.name](locator, options)
      throw new Error(message)
    },
    async toBeVisible() {
      return this.checkSingleElementCondition(Conditions.toBeVisible, {})
    },
    async toHaveText(text) {
      Assert.string(text, 'text must be of type string')
      return this.checkSingleElementCondition(Conditions.toHaveText, { text })
    },
    async toBeFocused() {
      return this.checkSingleElementCondition(Conditions.toBeFocused)
    },
    async toHaveCSS(key, value) {
      return this.checkSingleElementCondition(Conditions.toHaveCss, {
        key,
        value,
      })
    },
    async toHaveAttribute(key, value) {
      Assert.string(key, 'key must be of type string')
      Assert.string(value, 'value must be of type string')
      return this.checkSingleElementCondition(Conditions.toHaveAttribute, {
        key,
        value,
      })
    },
    async toHaveClass(className) {
      Assert.string(className, 'className must be of type string')
      return await this.checkSingleElementCondition(Conditions.toHaveClass, {
        className,
      })
    },
    async toHaveCount(count) {
      Assert.number(count, 'count must be of type string')
      return this.checkMultiElementCondition(
        MultiElementConditions.toHaveCount,
        { count }
      )
    },
    async toBeHidden() {
      return this.checkMultiElementCondition(
        MultiElementConditions.toBeHidden,
        {}
      )
    },
    get not() {
      this.negated = true
      return this
    },
  }
}

export const writeFile = async (path, content) => {
  const RendererWorker = await getRendererWorker()
  await new Promise((resolve) => requestIdleCallback(resolve))
  RendererWorker.send('FileSystem.writeFile', path, content)
}

export const mkdir = async (path) => {
  const RendererWorker = await getRendererWorker()
  await new Promise((resolve) => requestIdleCallback(resolve))
  RendererWorker.send('FileSystem.mkdir', path)
}
