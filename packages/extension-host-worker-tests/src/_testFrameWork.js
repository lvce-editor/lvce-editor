export const getTmpDir = async () => {
  return `memfs://`
}

const createLocator = () => {
  return {
    async click(options) {},
    first() {
      return createLocator()
    },
  }
}

const createPage = () => {
  return {
    locator(selector, options) {
      return createLocator()
    },
  }
}

export const runWithExtension = async (options) => {
  await new Promise((resolve) => {
    requestIdleCallback(resolve)
  })
  const RendererWorker = await import(
    '/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js'
  )
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

export const writeFile = async (path, content) => {}
