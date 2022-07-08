export const getTmpDir = async () => {
  return `memfs://`
}

const querySelectorByText = (text) => {
  let node
  const elements = []
  const walk = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null
  )
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
    return querySelectorByText(selector.slice('text='.length))
  }
  if (selector.startsWith('.')) {
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
    this.mouseEvent(element, 'mousedown', options)
  },
  mouseUp(element, options) {
    this.mouseEvent(element, 'mouseup', options)
  },
  contextMenu(element, options) {
    this.mouseEvent(element, 'contextmenu', options)
  },
  click(element, options) {
    this.mouseDown(element, options)
    this.mouseEvent(element, 'click', options)
    this.mouseUp(element, options)
    if (options.button === 2 /* right */) {
      console.log('dispatch context menu event')
      this.contextMenu(element, options)
    }
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

const createLocator = (selector, selectorOptions) => {
  return {
    async click({ button = 'left', retryCount = 3 } = {}) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // const
      // const $Element=document.querySelector(selectors)
      console.log({ selector })
      const elements = querySelector(selector)
      console.log('elements length', elements.length)
      console.log({ elements })
      if (elements.length === 0) {
        if (retryCount <= 0) {
          throw new Error(`selector not found: ${selector}`)
        }
        await new Promise((resolve) => {
          setTimeout(resolve, 1000)
        })
        return this.click({ button, retryCount: retryCount - 1 })
        // no elements found
      }
      if (elements.length === 1) {
        const element = elements[0]
        const clickOptions = {
          cancable: true,
          bubbles: true,
          button: toButtonNumber(button),
        }
        console.log({ clickOptions })
        ElementActions.click(element, clickOptions)
        // TODO dispatch click event
        return
      }
      if (selectorOptions.nth === -1) {
        throw new Error(`too many matching elements for ${selector}`)
      }
      const element = elements[selectorOptions.nth]
      if (!element) {
        throw new Error(`selector not found: ${selector}`)
      }
      const clickOptions = {
        cancable: true,
        bubbles: true,
        button: toButtonNumber(button),
      }
      console.log({ clickOptions })
      ElementActions.click(element, clickOptions)
    },
    first() {
      return createLocator(selector, {
        nth: 0,
      })
    },
  }
}

const createPage = () => {
  return {
    locator(selector, options) {
      return createLocator(selector, options)
    },
  }
}

const getRendererWorker = async () => {
  const RendererWorker = await import(
    '/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js'
  )
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
    RendererWorker.send('ExtensionHost.startWebExtensionHost')
    const absolutePath = new URL(
      `../fixtures/${options.name}/main.js`,
      location.href
    ).href
    console.log({ absolutePath })
    RendererWorker.send('ExtensionHost.loadWebExtension', absolutePath)
  }
  if (options.folder) {
    // TODO ask renderer worker to open this folder
    console.log('folder', options.folder)
    RendererWorker.send('Workspace.setPath', options.folder)
  }
  const page = createPage()
  return page
}

export const test = async (name, fn) => {
  console.info('starting', name)
  try {
    await fn()
  } catch (error) {
    error.message = `Test failed: ${name}: ${error.message}`
    console.error(error)
  }
  console.info('finished', name)
}

export const expect = (locator) => {
  return {
    async toBeVisible() {
      return true
    },
    async toHaveText(text) {
      return true
    },
  }
}

export const writeFile = async (path, content) => {
  const RendererWorker = await getRendererWorker()
  await new Promise((resolve) => requestIdleCallback(resolve))
  console.log({ RendererWorker })
  RendererWorker.send('FileSystem.writeFile', path, content)

  console.log({ path, content })
}
