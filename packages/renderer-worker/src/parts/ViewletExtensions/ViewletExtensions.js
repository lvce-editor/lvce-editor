import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionListItemHeight from '../ExtensionListItemHeight/ExtensionListItemHeight.js'
import * as ExtensionManagement from '../ExtensionManagement/ExtensionManagement.js' // TODO use Command.execute instead
import * as GetViewletSize from '../GetViewletSize/GetViewletSize.js'
import * as Platform from '../Platform/Platform.js'
import * as MinimumSliderSize from '../MinimumSliderSize/MinimumSliderSize.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletSize from '../ViewletSize/ViewletSize.js'
import * as VirtualList from '../VirtualList/VirtualList.js'
import * as ExtensionSearchViewWorker from '../ExtensionSearchViewWorker/ExtensionSearchViewWorker.js'
import * as ViewletExtensionsHandleInput from './ViewletExtensionsHandleInput.js'

const SUGGESTIONS = ['@builtin', '@disabled', '@enabled', '@installed', '@outdated', '@sort:installs', '@id:', '@category']

// then state can be recycled by Viewlet when there is only a single ViewletExtensions instance

export const saveState = (state) => {
  const { searchValue } = state
  return {
    searchValue,
  }
}

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    searchValue: '',
    suggestionState: /* Closed */ 0,
    disposed: false,
    width,
    height,
    handleOffset: 0,
    x,
    y,
    message: '',
    focused: false,
    size: ViewletSize.None,
    ...VirtualList.create({
      itemHeight: ExtensionListItemHeight.ExtensionListItemHeight,
      minimumSliderSize: MinimumSliderSize.minimumSliderSize,
      headerHeight: 41,
    }),
    allExtensions: [],
    placeholder: '',
    platform: Platform.platform,
  }
}

const getSavedValue = (savedState) => {
  if (savedState && savedState.searchValue) {
    return savedState.searchValue
  }
  return ''
}

export const loadContent = async (state, savedState) => {
  const { width } = state
  const searchValue = getSavedValue(savedState)
  // TODO just get local extensions on demand (not when query string is already different)
  const allExtensions = await ExtensionManagement.getAllExtensions()
  const size = GetViewletSize.getViewletSize(width)
  const newState = await ViewletExtensionsHandleInput.handleInput({ ...state, allExtensions, size }, searchValue)
  const commands = await ExtensionSearchViewWorker.invoke('SearchExtensions.render', state, newState)

  newState.commands = commands
  return newState
  // TODO get installed extensions from extension host
  // TODO just get local extensions on demand (not when query string is already different)
}

export const dispose = () => {}

// TODO lazyload this

// TODO show error / warning  when installment fails / times out
export const handleInstall = async (state, id) => {
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'installing',
  )
  try {
    await ExtensionManagement.install(/* id */ id)
  } catch (error) {
    // TODO have multi send command
    await RendererProcess.invoke(
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'uninstalled',
    )
    // TODO use command.execute
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'installed',
  )
}

// TODO lazyload this
export const handleUninstall = async (state, id) => {
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'uninstalling',
  )
  try {
    await ExtensionManagement.uninstall(id)
  } catch (error) {
    await RendererProcess.invoke(
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'installed',
    )
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'uninstalled',
  )
}

// TODO lazyload this
export const handleEnable = async (state, id) => {
  try {
    await ExtensionManagement.enable(id)
  } catch (error) {
    await RendererProcess.invoke(
      /* viewletSend */ 'Viewlet.send',
      /* id */ ViewletModuleId.Extensions,
      /* method */ 'setExtensionState',
      /* id */ id,
      /* state */ 'disabled',
    )
    ErrorHandling.handleError(error)
    return
  }
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'enabled',
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
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'setExtensionState',
    /* id */ id,
    /* state */ 'disabled',
  )
}

export const openSuggest = async (state) => {
  const filteredSuggestions = SUGGESTIONS
  state.suggestionState = /* Open */ 1
  await RendererProcess.invoke(
    /* viewletSend */ 'Viewlet.send',
    /* id */ ViewletModuleId.Extensions,
    /* method */ 'openSuggest',
    /* suggestions */ filteredSuggestions,
  )
}

export const closeSuggest = async (state) => {
  state.suggestionState = /* Closed */ 0
  await RendererProcess.invoke(/* viewletSend */ 'Viewlet.send', /* id */ ViewletModuleId.Extensions, /* method */ 'closeSuggest')
}

export const toggleSuggest = async (state) => {
  switch (state.suggestionState) {
    case /* Closed */ 0:
      await openSuggest(state)
      break
    case /* Open */ 1:
      await closeSuggest(state)
      break
    default:
      break
  }
}

export const handleBlur = (state) => {
  return {
    ...state,
    focused: false,
  }
}
