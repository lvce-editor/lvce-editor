import * as HtmlPreviewUrl from '../HtmlPreviewUrl/HtmlPreviewUrl.js'
import * as ExtensionViewUrl from '../ExtensionViewUrl/ExtensionViewUrl.js'
import * as Id from '../Id/Id.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const getBounds = ({ x, y, width, height, headerHeight }) => ({ x, y: y + headerHeight, width, height: Math.max(0, height - headerHeight) })

export const materialize = async (state, tab) => {
  if (tab.previewUid) return tab
  const uid = Id.create()
  const httpPreview = /^https?:\/\//i.test(tab.iframeSrc)
  const extensionView = ExtensionViewUrl.isExtensionViewUrl(tab.iframeSrc)
  const moduleId = extensionView || httpPreview ? ViewletModuleId.ExtensionView : 'Preview'
  const uri = httpPreview
    ? `browser-iframe:///${encodeURIComponent(tab.iframeSrc)}`
    : extensionView
      ? ExtensionViewUrl.decode(tab.iframeSrc)
      : HtmlPreviewUrl.decode(tab.iframeSrc)
  const tabIndex = Array.isArray(state.tabs)
    ? state.tabs.findIndex((candidate, index) => index === state.selectedTabIndex && candidate.iframeSrc === tab.iframeSrc)
    : -1
  const parentInstance = tabIndex >= 0 ? ViewletStates.getInstance(state.uid) : undefined
  // HTTP frames have a fixed tab title. Registering them in renderedState before
  // the parent renders would claim that their DOM wrapper already exists.
  if (!httpPreview && parentInstance && tabIndex >= 0) {
    const tabs = parentInstance.state.tabs.with(tabIndex, { ...parentInstance.state.tabs[tabIndex], previewUid: uid })
    ViewletStates.setRenderedState(state.uid, { ...parentInstance.renderedState, tabs })
  }
  const commands = await ViewletManager.load({
    type: 0,
    id: moduleId,
    uid,
    uri,
    parentUid: state.uid,
    show: false,
    getModule: ViewletModule.load,
    ...getBounds(state),
  })
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
  const childState = ViewletStates.getInstance(uid)?.state
  return { ...tab, previewUid: uid, title: childState?.title || tab.title }
}

export const dispose = (tab) => (tab.previewUid ? Viewlet.dispose(tab.previewUid) : undefined)

export const resize = async (state) => {
  const commands = await Promise.all(state.tabs.filter((tab) => tab.previewUid).map((tab) => Viewlet.resize(tab.previewUid, getBounds(state))))
  if (commands.length) await RendererProcess.invoke('Viewlet.sendMultiple', commands.flat())
}

export const reload = async (tab) => {
  if (tab.previewUid && /^https?:\/\//i.test(tab.iframeSrc)) {
    await Viewlet.executeViewletCommand(tab.previewUid, 'reloadBrowserIframe')
    return
  }
  if (tab.previewUid) await Viewlet.executeViewletCommand(tab.previewUid, 'setUri', HtmlPreviewUrl.decode(tab.iframeSrc))
}
