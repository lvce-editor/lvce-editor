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

const querySelector = (selector) => {
  if (typeof selector !== 'string') {
    throw new Error('selector must be of type string')
  }
  if (selector.startsWith('text=')) {
    // TODO get element by text content
    return querySelectorByText(selector.slice('text='.length))
  }
  return []
}

const ElementActions = {
  mouseEvent(element, eventType) {
    const event = new MouseEvent(eventType, {
      cancelable: true,
      bubbles: true,
    })
    element.dispatchEvent(event)
  },
  mouseDown(element) {
    this.mouseEvent(element, 'mousedown')
  },
  mouseUp(element) {
    this.mouseEvent(element, 'mouseup')
  },
  click(element) {
    this.mouseDown(element)
    this.mouseEvent(element, 'click')
    this.mouseUp(element)
  },
}

const createLocator = (selector, selectorOptions) => {
  return {
    async click(options) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // const
      // const $Element=document.querySelector(selectors)
      console.log({ selector })
      const elements = querySelector(selector)
      console.log('elements length', elements.length)
      console.log({ elements })
      if (elements.length === 0) {
        // no elements found
      } else if (elements.length === 1) {
        const element = elements[0]
        ElementActions.click(element)
        // TODO dispatch click event
      } else {
        // Too many matching elements
      }
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
  await fn()
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
