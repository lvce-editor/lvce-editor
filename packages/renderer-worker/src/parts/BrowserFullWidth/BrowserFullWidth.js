import * as ElectronWebContentsViewFunctions from '../ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js'
import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'
import * as BrowserWorkspaceFocus from '../BrowserWorkspaceFocus/BrowserWorkspaceFocus.js'
import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as LayoutPoints from '../ViewletLayout/LayoutPoints.ts'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const pending = new Map()
const layoutKeys = [
  'activityBarVisible',
  'activityBarSashVisible',
  'mainVisible',
  'panelVisible',
  'panelHeight',
  'panelMaximized',
  'panelHeightBeforeMaximize',
  'panelSashVisible',
  'sideBarVisible',
  'sideBarWidth',
  'sideBarLocation',
  'sideBarSashVisible',
  'secondarySideBarVisible',
  'secondarySideBarWidth',
  'statusBarVisible',
  'previewVisible',
  'previewWidth',
  'previewHeight',
  'previewOrientation',
  'previewSashVisible',
  'secondaryPreviewVisible',
  'secondaryPreviewWidth',
  'secondaryPreviewHeight',
  'secondaryPreviewSashVisible',
]

const getBrowsers = (state) =>
  [...new Set(ViewletStates.getValues())].filter(
    (instance) => instance.moduleId === 'SimpleBrowser' && ApplicationRegistry.getOwner(instance.state.uid) === state.applicationId,
  )

export const configureGesture = async () => {
  if (Platform.platform === PlatformType.Electron) {
    await ElectronWindow.setBrowserFullWidthGestureEnabled(Preferences.get('simpleBrowser.fullWidth.doubleControlEnabled') !== false)
  }
}

export const resize = async (state) => {
  const y = state.titleBarVisible ? state.titleBarHeight : 0
  const uid = state.browserFullWidth.browserUid
  const height = Math.max(0, state.windowHeight - y)
  const commands = await Viewlet.resize(uid, { x: 0, y, width: state.windowWidth, height })
  commands.push(['Viewlet.setBounds', uid, 0, 0, state.windowWidth, height])
  return commands
}

export const leave = async (state) => {
  const snapshot = state.browserFullWidth
  if (!snapshot) return { newState: state, commands: [] }
  const layout = { ...snapshot.layout }
  const contentHeight = Math.max(
    0,
    state.windowHeight - (state.titleBarVisible ? state.titleBarHeight : 0) - (layout.statusBarVisible ? state.statusBarHeight : 0),
  )
  const panelLimit = layout.panelMaximized ? contentHeight : Math.max(0, contentHeight - 100)
  layout.panelHeight = Math.min(layout.panelHeight, panelLimit)
  layout.panelHeightBeforeMaximize = Math.min(layout.panelHeightBeforeMaximize, Math.max(0, contentHeight - 100))
  const newState = LayoutPoints.getPoints({
    ...state,
    ...layout,
    panelMinHeight: Math.min(state.panelMinHeight, panelLimit),
    browserFullWidth: undefined,
  })
  const ViewletLayout = await import('../ViewletLayout/ViewletLayout.ts')
  const commands = await ViewletLayout.getResizeCommands(state, newState)
  if (snapshot.browserUid !== state.previewId && snapshot.browserUid !== state.secondaryPreviewId) {
    const browser = ViewletStates.getInstance(snapshot.browserUid)
    if (browser) commands.push(['Viewlet.setBounds', snapshot.browserUid, 0, 0, browser.state.width, browser.state.height])
  }
  return { newState, commands }
}

export const toggleInternal = async (initialState, requestedUid) => {
  if (initialState.browserFullWidth) return leave(initialState)
  const ViewletLayout = await import('../ViewletLayout/ViewletLayout.ts')
  let state = initialState
  const commands = []
  if (state.sideBarFocusMode) {
    const result = await ViewletLayout.leaveSideBarFocusMode(state)
    state = result.newState
    commands.push(...result.commands)
  }
  let browsers = getBrowsers(state)
  const focusedUid = requestedUid ?? ViewletStates.getFocusedInstanceByType('SimpleBrowser', state.applicationId)
  const focusInfo = await Promise.all(
    browsers.map(async (item) => {
      const native =
        Platform.platform === PlatformType.Electron && item.state.browserViewId
          ? await ElectronWebContentsViewFunctions.getStats(item.state.browserViewId).catch(() => ({}))
          : {}
      return {
        item,
        score: native.isFocused
          ? Number.POSITIVE_INFINITY
          : Math.max(native.lastFocusedAt || 0, BrowserWorkspaceFocus.getBrowserFocusTime(item.state.uid)),
      }
    }),
  )
  focusInfo.sort((a, b) => b.score - a.score)
  let browser =
    browsers.find((item) => item.state.uid === requestedUid) ||
    (focusInfo[0]?.score > 0 ? focusInfo[0].item : browsers.find((item) => item.state.uid === focusedUid)) ||
    browsers[0]
  if (!browser) {
    const result = await ViewletLayout.showPreview({ ...state, previewWidth: state.windowWidth / 2 }, 'simple-browser://')
    state = result.newState
    commands.push(...result.commands)
    await RendererProcess.invoke('Viewlet.sendMultiple', commands.splice(0))
    browsers = getBrowsers(state)
    browser = browsers.find((item) => item.state.uid === state.previewId)
  }
  if (!browser) return { newState: state, commands }
  const browserUid = browser.state.uid
  await RendererProcess.invoke('Window.rememberBrowserParent', browserUid)
  const addressSelection = await RendererProcess.invoke('Window.captureBrowserAddress', browserUid)
  await Viewlet.executeViewletCommand(browserUid, 'prepareFullWidth')
  // Move focus into the retained reference before the layout renderer detaches IDE panes.
  // Its focus-preservation pass otherwise removes the focused input from a hidden pane.
  if (!addressSelection) await RendererProcess.invoke('Viewlet.focusSelector', browserUid, '.SimpleBrowserFullWidthButton')
  const { x, y, width, height } = browser.state
  const hiddenBrowserUids = browsers.filter((item) => item !== browser && item.factory.isVisible(item.state)).map((item) => item.state.uid)
  const snapshot = {
    browserUid,
    browserWasVisible: browser.factory.isVisible(browser.state),
    browserBounds: { x, y, width, height },
    layout: Object.fromEntries(layoutKeys.map((key) => [key, state[key]])),
    ideFocusUid: BrowserWorkspaceFocus.get(state.applicationId),
    addressFocused: Boolean(addressSelection),
    addressSelection,
    hiddenBrowserUids,
  }
  const newState = LayoutPoints.getPoints({ ...state, browserFullWidth: snapshot })
  commands.push(...(await resize(newState)))
  return { newState, commands }
}

export const toggle = (state, browserUid) => {
  const uid = state.uid
  const previous = pending.get(uid) || Promise.resolve()
  const next = previous.catch(() => {}).then(() => Viewlet.executeViewletCommand(uid, 'toggleSimpleBrowserFullWidthInternal', browserUid))
  pending.set(uid, next)
  return next.finally(() => {
    if (pending.get(uid) === next) pending.delete(uid)
  })
}
toggle.returnValue = true

export const handleGesture = (state) => {
  if (Preferences.get('simpleBrowser.fullWidth.doubleControlEnabled') === false) return
  return toggle(state)
}
handleGesture.returnValue = true

export const afterRender = async (oldState, newState) => {
  const previous = oldState.browserFullWidth
  const current = newState.browserFullWidth
  if (previous === current) return
  // Layout roots contain multiple address inputs with the same name. Restore each
  // retained browser's own value after the root renderer preserves named inputs.
  await RendererProcess.invoke(
    'Viewlet.sendMultiple',
    getBrowsers(newState).map(({ state }) => ['Viewlet.setValueByName', state.uid, 'simple-browser-address', state.inputValue]),
  )
  if (current) {
    for (const uid of current.hiddenBrowserUids) {
      const browser = ViewletStates.getInstance(uid)
      if (browser) {
        await Viewlet.executeViewletCommand(uid, 'prepareFullWidth')
        await browser.factory.hide(browser.state)
      }
    }
    await Viewlet.executeViewletCommand(current.browserUid, 'setFullWidth', true, current.addressSelection)
    return
  }
  if (!previous) return
  await RendererProcess.invoke('Window.restoreBrowserParent', previous.browserUid)
  if (ViewletStates.getInstance(previous.browserUid)) await Viewlet.executeViewletCommand(previous.browserUid, 'setFullWidth', false)
  const previousBrowser = ViewletStates.getInstance(previous.browserUid)
  if (previous.browserWasVisible === false && previousBrowser) await previousBrowser.factory.hide(previousBrowser.state)
  for (const uid of previous.hiddenBrowserUids) {
    const browser = ViewletStates.getInstance(uid)
    if (browser) await browser.factory.show(browser.state)
  }
  if (Platform.platform === PlatformType.Electron) await ElectronWindow.focus()
  if (await RendererProcess.invoke('Window.restoreCodingFocus')) return
  const target =
    (typeof previous.ideFocusUid === 'number' && ViewletStates.getInstance(previous.ideFocusUid)) ||
    ViewletStates.getInstance('EditorText', newState.applicationId)
  if (target) {
    if (target.moduleId === 'Editor' || target.moduleId === 'EditorText') {
      await Viewlet.executeViewletCommand(target.state.uid, 'handleFocus')
      await RendererProcess.invoke('Viewlet.focusSelector', target.state.uid, '[name="editor"]')
      return
    }
    const commands = await Viewlet.getFocusCommands(target.state.uid)
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  }
}

export const loadContentLater = async (state) => {
  await configureGesture()
  return state
}

export const handleDispose = async (browserUid) => {
  BrowserWorkspaceFocus.removeBrowser(browserUid)
  const layout = ViewletStates.getValues().find(
    (instance) => instance.moduleId === 'Layout' && instance.state.browserFullWidth?.browserUid === browserUid,
  )
  if (layout) await Viewlet.executeViewletCommand(layout.state.uid, 'leaveSimpleBrowserFullWidth')
}
