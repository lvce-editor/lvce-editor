import * as ActionType from '../ActionType/ActionType.js'
import { assetDir } from '../AssetDir/AssetDir.js'
import * as Command from '../Command/Command.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as Focus from '../Focus/Focus.js'
import type { ExtensionView } from '../GetExtensionViews/GetExtensionViews.ts'
import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as GetExtensionViews from '../GetExtensionViews/GetExtensionViews.ts'
import { getPlatform } from '../Platform/Platform.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as VirtualDomHelpers from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'
import type { ViewletExtensionViewState } from './ViewletExtensionViewState.ts'

// Keep extension state changes, DOM patches, and focus updates in event order.
export const serializeCommands = true

interface ViewRenderResult {
  readonly css?: string
  readonly dom?: readonly unknown[]
  readonly focusSelector?: string
  readonly modified?: boolean
  readonly patches?: readonly unknown[]
  readonly scrollPosition?: readonly [selector: string, scrollTop: number]
  readonly title?: string
  readonly type: string
}

interface CreateViewInstanceSuccess {
  readonly eventListeners?: readonly unknown[]
  readonly ok: true
  readonly result: ViewRenderResult
  readonly stateful?: boolean
}

interface CreateViewInstanceError {
  readonly error: {
    readonly message: string
    readonly name: string
    readonly stack?: string
  }
  readonly ok: false
}

type CreateViewInstanceResult = CreateViewInstanceSuccess | CreateViewInstanceError

interface ViewAction {
  readonly command: string
  readonly icon: string
  readonly title: string
}

const disabledExtensions = new Set<string>()

const getExtensionKey = (applicationId: string | undefined, extensionId: string): string => `${applicationId || ''}\0${extensionId}`

const isExtensionDisabled = ({ applicationId, disabled, extensionId }: ViewletExtensionViewState, changedExtensionId = extensionId): boolean => {
  return disabled === true || (changedExtensionId !== undefined && disabledExtensions.has(getExtensionKey(applicationId, changedExtensionId)))
}

const getDisabledState = (state: ViewletExtensionViewState): ViewletExtensionViewState => {
  return {
    ...state,
    actionsDom: [],
    commands: [],
    css: '',
    cssId: '',
    disabled: true,
    dom: [VirtualDomHelpers.text('Extension contributing this view has been disabled')],
    eventListeners: [],
    focusSelector: '',
    iframeSandbox: [],
    iframeSrc: '',
    kind: 'virtualDom',
    modified: undefined,
    patches: [],
    stateful: false,
  }
}

const restoreError = (serializedError: CreateViewInstanceError['error']): Error => {
  const error = new Error(serializedError.message)
  error.name = serializedError.name
  if (serializedError.stack) {
    error.stack = serializedError.stack
  }
  return error
}

const getCssId = (view: ExtensionView): string => {
  return `ExtensionView:${view.id}`
}

const loadCss = async (view: ExtensionView): Promise<string> => {
  if (!view.css) {
    return ''
  }
  try {
    const response = await fetch(view.css)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.text()
  } catch (error) {
    console.warn(`[renderer-worker] Failed to load css for extension view ${view.id}: ${error}`)
    return ''
  }
}

const createContext = (state: ViewletExtensionViewState, savedState: unknown): unknown => {
  return {
    state: savedState,
    uid: state.uid,
    uri: state.uri,
    viewId: state.viewId,
  }
}

const getScrollPositionCommands = (state: ViewletExtensionViewState, result: ViewRenderResult): readonly (readonly unknown[])[] => {
  if (!result.scrollPosition) {
    return []
  }
  const [selector, scrollTop] = result.scrollPosition
  return [['Viewlet.setProperty', state.uid, selector, 'scrollTop', scrollTop]]
}

const getCssCommands = (state: ViewletExtensionViewState, result: ViewRenderResult): readonly (readonly unknown[])[] => {
  if (typeof result.css !== 'string') {
    return []
  }
  return [['Viewlet.setCss', state.uid, result.css]]
}

const renderVirtualDomResult = (state: ViewletExtensionViewState, result: ViewRenderResult | undefined): ViewletExtensionViewState => {
  if (!result) {
    return {
      ...state,
      commands: [],
      focusSelector: '',
      patches: [],
    }
  }
  return {
    ...state,
    commands: [...getScrollPositionCommands(state, result), ...getCssCommands(state, result)],
    dom: result.type === 'setDom' ? result.dom || [] : state.dom,
    focusSelector: typeof result.focusSelector === 'string' ? result.focusSelector : '',
    patches: result.type === 'setPatches' ? result.patches || [] : [],
    ...(typeof result.modified === 'boolean' && { modified: result.modified }),
    title: typeof result.title === 'string' ? result.title : state.title,
  }
}

const getViewTitle = (view: GetExtensionViews.ExtensionView): string => {
  return view.displayName || view.name || view.title
}

const getActionsDom = async (state: ViewletExtensionViewState): Promise<readonly unknown[]> => {
  if (isExtensionDisabled(state) || state.kind !== 'virtualDom') {
    return []
  }
  const actionsDom = (await ExtensionManagementWorker.invoke('Extensions.getViewActionsDom', state.viewId, state.uid, assetDir, getPlatform())) as
    readonly unknown[] | undefined
  if (isExtensionDisabled(state)) {
    return []
  }
  if (actionsDom !== undefined) {
    return actionsDom
  }
  const actions = (await ExtensionManagementWorker.invoke(
    'Extensions.getViewActions',
    state.viewId,
    state.uid,
    assetDir,
    getPlatform(),
  )) as readonly ViewAction[]
  if (isExtensionDisabled(state)) {
    return []
  }
  if (actions.length === 0) {
    return []
  }
  return GetActionsVirtualDom.getActionsVirtualDom(
    actions.map((action) => ({
      command: action.command,
      icon: action.icon,
      id: action.title,
      type: ActionType.Button,
    })),
  )
}

export const create = (
  id: number,
  uri: string,
  x: number,
  y: number,
  width: number,
  height: number,
  _args?: unknown,
  parentUid?: number,
): ViewletExtensionViewState => {
  return {
    actionsDom: [],
    commands: [],
    css: '',
    cssId: '',
    csp: '',
    credentialless: true,
    dom: [],
    eventListeners: [],
    focusSelector: '',
    height,
    iframeSandbox: [],
    iframeSrc: '',
    kind: '',
    parentUid,
    patches: [],
    stateful: false,
    title: '',
    uid: id,
    uri,
    viewId: uri,
    width,
    x,
    y,
  }
}

export const loadContent = async (
  state: ViewletExtensionViewState,
  savedState: unknown,
  options: { readonly opener?: string } = {},
): Promise<ViewletExtensionViewState> => {
  const view = await GetExtensionViews.getExtensionView(options.opener || state.uri, state.applicationId)
  if (!view) {
    throw new Error(`view ${state.uri} not found`)
  }
  const stateWithViewId = {
    ...state,
    extensionId: view.extensionId,
    viewId: view.id,
  }
  if (isExtensionDisabled(stateWithViewId)) {
    return getDisabledState(stateWithViewId)
  }
  const title = getViewTitle(view)
  const css = await loadCss(view)
  if (isExtensionDisabled(stateWithViewId)) {
    return getDisabledState(stateWithViewId)
  }
  const cssId = css ? getCssId(view) : ''
  const contributedEventListeners = view.eventListeners || []
  if (view.kind === 'virtualDom') {
    const result = await ExtensionManagementWorker.invoke(
      'Extensions.createViewInstance',
      view.id,
      state.uid,
      createContext(stateWithViewId, savedState),
      assetDir,
      getPlatform(),
      state.applicationId,
    )
    const createResult = result as CreateViewInstanceResult
    if (createResult.ok === false) {
      throw restoreError(createResult.error)
    }
    if (isExtensionDisabled(stateWithViewId)) {
      return getDisabledState(stateWithViewId)
    }
    const renderResult = createResult.ok === true ? createResult.result : (result as ViewRenderResult)
    const eventListeners = createResult.ok === true ? createResult.eventListeners || contributedEventListeners : contributedEventListeners
    const initialState = {
      ...stateWithViewId,
      title,
    }
    const newState = {
      ...renderVirtualDomResult(initialState, renderResult),
      css,
      cssId,
      eventListeners,
      kind: view.kind,
      stateful: createResult.ok === true && createResult.stateful === true,
    }
    const loadedState = {
      ...newState,
      actionsDom: await getActionsDom(newState),
    }
    return isExtensionDisabled(loadedState) ? getDisabledState(loadedState) : loadedState
  }
  if (!view.iframe) {
    throw new Error(`view ${state.uri} is missing iframe contribution`)
  }
  const loadedState = {
    ...stateWithViewId,
    actionsDom: [],
    css,
    cssId,
    csp: view.iframe.csp,
    credentialless: view.iframe.credentialless,
    eventListeners: contributedEventListeners,
    iframeSandbox: view.iframe.sandbox,
    iframeSrc: view.iframe.src,
    kind: 'iframe',
    title,
  }
  return isExtensionDisabled(loadedState) ? getDisabledState(loadedState) : loadedState
}

export const hasFunctionalResize = true

export const resize = (state: ViewletExtensionViewState, dimensions: any): ViewletExtensionViewState => {
  return {
    ...state,
    ...dimensions,
  }
}

const dispatchEvent = async (state: ViewletExtensionViewState, event: unknown): Promise<ViewletExtensionViewState> => {
  if (isExtensionDisabled(state) || state.kind !== 'virtualDom') {
    return state
  }
  const result = await ExtensionManagementWorker.invoke('Extensions.dispatchViewEvent', state.viewId, state.uid, event, assetDir, getPlatform())
  if (isExtensionDisabled(state)) {
    return getDisabledState(state)
  }
  const newState = renderVirtualDomResult(state, result as ViewRenderResult | undefined)
  if (isExtensionDisabled(state)) {
    return getDisabledState(state)
  }
  const updatedState = {
    ...newState,
    actionsDom: await getActionsDom(newState),
  }
  return isExtensionDisabled(updatedState) ? getDisabledState(updatedState) : updatedState
}

export const handleViewEvent = (
  state: ViewletExtensionViewState,
  type: string,
  name: string,
  value?: unknown,
): Promise<ViewletExtensionViewState> => {
  if (!isExtensionDisabled(state) && state.kind === 'virtualDom' && (type === 'click' || type === 'focus')) {
    Focus.setFocus(WhenExpression.Empty, undefined, state.uid, ViewletModuleId.ExtensionView)
  }
  return dispatchEvent(state, {
    name,
    type,
    ...(value !== undefined && { value }),
  })
}

export const handleViewCommand = (
  state: ViewletExtensionViewState,
  handler: string,
  ...args: readonly unknown[]
): Promise<ViewletExtensionViewState> => {
  return dispatchEvent(state, {
    args,
    handler,
    type: 'command',
  })
}

export const rerender = async (state: ViewletExtensionViewState): Promise<ViewletExtensionViewState> => {
  if (isExtensionDisabled(state) || state.kind !== 'virtualDom') {
    return state
  }
  const result = await ExtensionManagementWorker.invoke('Extensions.renderViewInstance', state.viewId, state.uid, assetDir, getPlatform())
  if (isExtensionDisabled(state)) {
    return getDisabledState(state)
  }
  const newState = renderVirtualDomResult(state, result as ViewRenderResult)
  if (isExtensionDisabled(state)) {
    return getDisabledState(state)
  }
  const updatedState = {
    ...newState,
    actionsDom: await getActionsDom(newState),
  }
  return isExtensionDisabled(updatedState) ? getDisabledState(updatedState) : updatedState
}

export const isComponentStateAvailable = (state: ViewletExtensionViewState): boolean => !isExtensionDisabled(state) && state.kind === 'virtualDom' && state.stateful

export const isComponentDomAvailable = (state: ViewletExtensionViewState): boolean => state.kind === 'virtualDom'

export const getComponentDom = (state: ViewletExtensionViewState): readonly unknown[] => state.dom

export const getComponentState = async (state: ViewletExtensionViewState): Promise<unknown> => {
  if (isExtensionDisabled(state)) {
    return undefined
  }
  const componentState = await ExtensionManagementWorker.invoke('Extensions.getViewInstanceState', state.viewId, state.uid, assetDir, getPlatform())
  return isExtensionDisabled(state) ? undefined : componentState
}

export const setComponentState = async (state: ViewletExtensionViewState, componentState: unknown): Promise<ViewletExtensionViewState> => {
  if (isExtensionDisabled(state)) {
    return state
  }
  const result = await ExtensionManagementWorker.invoke(
    'Extensions.setViewInstanceState',
    state.viewId,
    state.uid,
    componentState,
    assetDir,
    getPlatform(),
  )
  if (isExtensionDisabled(state)) {
    return getDisabledState(state)
  }
  const newState = renderVirtualDomResult(state, result as ViewRenderResult | undefined)
  const updatedState = {
    ...newState,
    actionsDom: await getActionsDom(newState),
  }
  return isExtensionDisabled(updatedState) ? getDisabledState(updatedState) : updatedState
}

export const handleClickAction = async (state: ViewletExtensionViewState, index: number, command: string): Promise<ViewletExtensionViewState> => {
  void index
  if (isExtensionDisabled(state)) {
    return state
  }
  await Command.execute('ExtensionHost.executeCommand', command)
  return isExtensionDisabled(state) ? getDisabledState(state) : state
}

export const handleInput = (state: ViewletExtensionViewState, name: string, value: string): Promise<ViewletExtensionViewState> => {
  return handleViewEvent(state, 'input', name, value)
}

export const handleClick = (state: ViewletExtensionViewState, name: string): Promise<ViewletExtensionViewState> => {
  return handleViewEvent(state, 'click', name)
}

export const handleSubmit = (state: ViewletExtensionViewState, name: string): Promise<ViewletExtensionViewState> => {
  return handleViewEvent(state, 'submit', name)
}

export const handleFocus = (state: ViewletExtensionViewState, name: string): Promise<ViewletExtensionViewState> => {
  return handleViewEvent(state, 'focus', name)
}

export const handleBlur = (state: ViewletExtensionViewState, name: string): Promise<ViewletExtensionViewState> => {
  return handleViewEvent(state, 'blur', name)
}

export const handleContextMenu = (state: ViewletExtensionViewState, name: string, x: number, y: number): Promise<ViewletExtensionViewState> => {
  return dispatchEvent(state, {
    name,
    type: 'contextmenu',
    x,
    y,
  })
}

export const handleActiveEditorChange = async (state: ViewletExtensionViewState, activeUri: string): Promise<ViewletExtensionViewState> => {
  const { kind, uid, uri, viewId } = state
  if (isExtensionDisabled(state) || kind !== 'virtualDom') {
    return state
  }
  await ExtensionManagementWorker.invoke('Extensions.setViewInstanceActive', viewId, uid, uri === activeUri, assetDir, getPlatform())
  return isExtensionDisabled(state) ? getDisabledState(state) : state
}

export const save = async (state: ViewletExtensionViewState): Promise<ViewletExtensionViewState> => {
  if (isExtensionDisabled(state) || state.modified !== true) {
    return state
  }
  return handleViewCommand(state, 'save')
}

export const afterRender = async (oldState: ViewletExtensionViewState, newState: ViewletExtensionViewState): Promise<void> => {
  if (!newState.uri || newState.modified === undefined || oldState.modified === newState.modified) {
    return
  }
  if (newState.applicationId !== undefined) {
    await Command.execute('Application.execute', newState.applicationId, 'Main.handleModifiedStatusChange', newState.uri, newState.modified)
  } else {
    await Command.execute('Main.handleModifiedStatusChange', newState.uri, newState.modified)
  }
}

export const Commands = {
  save,
  handleExtensionsChanged,
  handleActiveEditorChange,
  handleBlur,
  handleContextMenu,
  handleClick,
  handleClickAction,
  handleFocus,
  handleInput,
  handleSubmit,
  handleViewCommand,
  handleViewEvent,
  loadContent,
  rerender,
}

export function handleExtensionsChanged(state: ViewletExtensionViewState, extensionId?: string, disabled?: boolean): ViewletExtensionViewState {
  if (!extensionId) {
    return state
  }
  const key = getExtensionKey(state.applicationId, extensionId)
  if (disabled) {
    disabledExtensions.add(key)
  } else {
    disabledExtensions.delete(key)
  }
  return state.extensionId === extensionId && disabled && !state.disabled ? getDisabledState(state) : state
}

export const dispose = async (state: ViewletExtensionViewState): Promise<void> => {
  if (isExtensionDisabled(state) || state.kind !== 'virtualDom') {
    return
  }
  await ExtensionManagementWorker.invoke('Extensions.disposeViewInstance', state.viewId, state.uid, assetDir, getPlatform())
}

export const saveState = async (state: ViewletExtensionViewState): Promise<unknown> => {
  if (isExtensionDisabled(state) || state.kind !== 'virtualDom') {
    return undefined
  }
  const savedState = await ExtensionManagementWorker.invoke('Extensions.saveViewInstanceState', state.viewId, state.uid, assetDir, getPlatform())
  return isExtensionDisabled(state) ? undefined : savedState
}
