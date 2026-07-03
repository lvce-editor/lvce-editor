import { assetDir } from '../AssetDir/AssetDir.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as GetExtensionViews from '../GetExtensionViews/GetExtensionViews.ts'
import type { ExtensionView } from '../GetExtensionViews/GetExtensionViews.ts'
import { getPlatform } from '../Platform/Platform.js'
import type { ViewletExtensionViewState } from './ViewletExtensionViewState.ts'

interface ViewRenderResult {
  readonly dom?: readonly unknown[]
  readonly patches?: readonly unknown[]
  readonly type: string
}

interface CreateViewInstanceSuccess {
  readonly ok: true
  readonly result: ViewRenderResult
}

interface CreateViewInstanceError {
  readonly error: unknown
  readonly ok: false
}

type CreateViewInstanceResult = CreateViewInstanceSuccess | CreateViewInstanceError

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
    viewId: state.uri,
  }
}

const renderVirtualDomResult = (state: ViewletExtensionViewState, result: ViewRenderResult | undefined): ViewletExtensionViewState => {
  if (!result) {
    return {
      ...state,
      commands: [],
      patches: [],
    }
  }
  return {
    ...state,
    commands: [],
    dom: result.type === 'setDom' ? result.dom || [] : state.dom,
    error: undefined,
    patches: result.type === 'setPatches' ? result.patches || [] : [],
  }
}

export const create = (id: number, uri: string, x: number, y: number, width: number, height: number): ViewletExtensionViewState => {
  return {
    commands: [],
    css: '',
    cssId: '',
    csp: '',
    credentialless: true,
    dom: [],
    height,
    iframeSandbox: [],
    iframeSrc: '',
    kind: '',
    patches: [],
    title: '',
    uid: id,
    uri,
    width,
    x,
    y,
  }
}

export const loadContent = async (state: ViewletExtensionViewState, savedState: unknown): Promise<ViewletExtensionViewState> => {
  const view = await GetExtensionViews.getExtensionView(state.uri)
  if (!view) {
    throw new Error(`view ${state.uri} not found`)
  }
  const css = await loadCss(view)
  const cssId = css ? getCssId(view) : ''
  if (view.kind === 'virtualDom') {
    const result = await ExtensionManagementWorker.invoke(
      'Extensions.createViewInstance',
      state.uri,
      state.uid,
      createContext(state, savedState),
      assetDir,
      getPlatform(),
    )
    const createResult = result as CreateViewInstanceResult
    if (createResult.ok === false) {
      return {
        ...state,
        commands: [],
        css,
        cssId,
        error: createResult.error,
        kind: view.kind,
        patches: [],
        title: view.title,
      }
    }
    const renderResult = createResult.ok === true ? createResult.result : (result as ViewRenderResult)
    return {
      ...renderVirtualDomResult(state, renderResult),
      css,
      cssId,
      kind: view.kind,
      title: view.title,
    }
  }
  if (!view.iframe) {
    throw new Error(`view ${state.uri} is missing iframe contribution`)
  }
  return {
    ...state,
    css,
    cssId,
    csp: view.iframe.csp,
    credentialless: view.iframe.credentialless,
    iframeSandbox: view.iframe.sandbox,
    iframeSrc: view.iframe.src,
    kind: 'iframe',
    title: view.title,
  }
}

export const hasFunctionalResize = true

export const resize = (state: ViewletExtensionViewState, dimensions: any): ViewletExtensionViewState => {
  return {
    ...state,
    ...dimensions,
  }
}

const dispatchEvent = async (state: ViewletExtensionViewState, event: unknown): Promise<ViewletExtensionViewState> => {
  if (state.kind !== 'virtualDom') {
    return state
  }
  const result = await ExtensionManagementWorker.invoke('Extensions.dispatchViewEvent', state.uri, state.uid, event, assetDir, getPlatform())
  return renderVirtualDomResult(state, result as ViewRenderResult | undefined)
}

export const handleInput = (state: ViewletExtensionViewState, name: string, value: string): Promise<ViewletExtensionViewState> => {
  return dispatchEvent(state, {
    name,
    type: 'input',
    value,
  })
}

export const handleClick = (state: ViewletExtensionViewState, name: string): Promise<ViewletExtensionViewState> => {
  return dispatchEvent(state, {
    name,
    type: 'click',
  })
}

export const handleSubmit = (state: ViewletExtensionViewState, name: string): Promise<ViewletExtensionViewState> => {
  return dispatchEvent(state, {
    name,
    type: 'submit',
  })
}

export const handleFocus = (state: ViewletExtensionViewState, name: string): Promise<ViewletExtensionViewState> => {
  return dispatchEvent(state, {
    name,
    type: 'focus',
  })
}

export const handleBlur = (state: ViewletExtensionViewState, name: string): Promise<ViewletExtensionViewState> => {
  return dispatchEvent(state, {
    name,
    type: 'blur',
  })
}

export const Commands = {
  handleBlur,
  handleClick,
  handleFocus,
  handleInput,
  handleSubmit,
}

export const dispose = async (state: ViewletExtensionViewState): Promise<void> => {
  if (state.kind !== 'virtualDom') {
    return
  }
  await ExtensionManagementWorker.invoke('Extensions.disposeViewInstance', state.uri, state.uid, assetDir, getPlatform())
}

export const saveState = async (state: ViewletExtensionViewState): Promise<unknown> => {
  if (state.kind !== 'virtualDom') {
    return undefined
  }
  return ExtensionManagementWorker.invoke('Extensions.saveViewInstanceState', state.uri, state.uid, assetDir, getPlatform())
}
