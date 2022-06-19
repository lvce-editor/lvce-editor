import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js' // TODO use Command.execute instead
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletList from './ViewletList.js'

export const ITEM_HEIGHT = 62

const MINIMUM_SLIDER_SIZE = 20

export const name = 'ExtensionsList'

// then state can be recycled by Viewlet when there is only a single ViewletExtensions instance

export const create = (id, uri, left, top, width, height) => {
  return {
    filteredExtensions: [],
    disposed: false,
    focusedIndex: -1,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 0,
    width,
    height,
    negativeMargin: 0,
    scrollBarHeight: 0,
    handleOffset: 0,
    top,
    left,
    finalDeltaY: 2728,
  }
}

const getVisible = (state) => {
  return state.filteredExtensions.slice(state.minLineY, state.maxLineY)
}

export const loadContent = async (state) => {
  return state
}

export const contentLoaded = async (state) => {}

const RE_PUBLISHER = /^[a-z\d\-]+/

// TODO handle case when extension is of type number|array|null|string
const getPublisher = (extension) => {
  if (!extension || !extension.id) {
    return 'n/a'
  }
  // TODO handle case when id is not of type string -> should not crash application
  const match = extension.id.match(RE_PUBLISHER)
  if (!match) {
    return 'n/a'
  }
  return match[0]
}

// TODO all icon related logic should be here, not in renderer process
const getIcon = (extension) => {
  if (!extension || !extension.path || !extension.icon) {
    return ''
  }
  if (Platform.getPlatform() === 'remote') {
    return `/remote/${extension.path}/${extension.icon}` // TODO support windows paths
  }
  if (Platform.getPlatform() === 'electron') {
    return `/remote/${extension.path}/${extension.icon}` // TODO support windows paths
  }
  return ''
}

const getName = (extension) => {
  if (extension && extension.name) {
    return extension.name
  }
  if (extension && extension.id) {
    return extension.id
  }
  return 'n/a'
}

const getVersion = (extension) => {
  if (!extension || !extension.version) {
    return 'n/a'
  }
  return extension.version
}

const getDescription = (extension) => {
  if (!extension || !extension.description) {
    return 'n/a'
  }
  return extension.description
}

const getId = (extension) => {
  if (!extension || !extension.id) {
    return 'n/a'
  }
  return extension.id
}

const toInstalledViewObject = (extension) => {
  return {
    name: getName(extension),
    publisher: getPublisher(extension),
    version: getVersion(extension),
    description: getDescription(extension),
    // TODO type field: builtin|marketplace|external
    // TODO should be status
    state: 'installed',
    id: getId(extension),
    icon: getIcon(extension),
  }
}

const toDisabledViewObject = (extension) => {
  return {
    name: extension.name,
    publisher: extension.authorId || extension.publisher,
    version: extension.version,
    // TODO type field: builtin|marketplace|external
    // TODO should be status
    state: 'disabled',
    id: extension.id,
  }
}

export const dispose = () => {}

// TODO show error / warning  when installment fails / times out
export const handleInstall = async (state, id) => {
  await RendererProcess.invoke(
    /* viewletSend */ 3024,
    /* id */ 'Extensions',
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'installing'
  )
  try {
    await ExtensionManagement.install(/* id */ id)
  } catch (error) {
    // TODO have multi send command
    await RendererProcess.invoke(
      /* viewletSend */ 3024,
      /* id */ 'Extensions',
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'uninstalled'
    )
    // TODO use command.execute
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 3024,
    /* id */ 'Extensions',
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'installed'
  )
}

// TODO lazyload this
export const handleUninstall = async (state, id) => {
  await RendererProcess.invoke(
    /* viewletSend */ 3024,
    /* id */ 'Extensions',
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'uninstalling'
  )
  try {
    await ExtensionManagement.uninstall(id)
  } catch (error) {
    await RendererProcess.invoke(
      /* viewletSend */ 3024,
      /* id */ 'Extensions',
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'installed'
    )
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 3024,
    /* id */ 'Extensions',
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'uninstalled'
  )
}

// TODO lazyload this
export const handleEnable = async (state, id) => {
  try {
    await ExtensionManagement.enable(id)
  } catch (error) {
    await RendererProcess.invoke(
      /* viewletSend */ 3024,
      /* id */ 'Extensions',
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'disabled'
    )
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 3024,
    /* id */ 'Extensions',
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'enabled'
  )
}

// TODO lazyload this
export const handleDisable = async (state, id) => {
  try {
    await ExtensionManagement.disable(id)
  } catch (error) {
    console.error(error)
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 3024,
    /* id */ 'Extensions',
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'disabled'
  )
}

// TODO pass index instead
export const handleContextMenu = async (state, x, y, extensionId) => {
  await Command.execute(
    /* ContextMenu.show */ 951,
    /* x */ x,
    /* y */ y,
    /* id */ 'manageExtension'
  )
}

export const resize = (state, dimensions) => {
  // TODO should just return new state, render function can take old state and new state and return render commands
  const listHeight = dimensions.height
  const maxLineY = state.minLineY + Math.ceil(listHeight / ITEM_HEIGHT)
  return {
    newState: {
      ...state,
      ...dimensions,
      maxLineY,
    },
    commands: [],
  }
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  return [
    {
      component: ViewletList,
      oldState,
      newState,
    },
  ]
}
